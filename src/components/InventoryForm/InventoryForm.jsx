import { useState } from 'react';

function InventoryForm({ onSubmit, onClose, initialData }) {
  const [formData, setFormData] = useState({
    inventory_name: initialData?.inventory_name || '',
    description: initialData?.description || '',
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.inventory_name.trim()) {
      newErrors.inventory_name = 'Назва обов\'язкова';
    }
    if (!initialData && !formData.photo) {
      newErrors.photo = 'Фото обов\'язкове';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const submitData = new FormData();
    submitData.append('inventory_name', formData.inventory_name);
    submitData.append('description', formData.description);
    if (formData.photo) submitData.append('photo', formData.photo);

    await onSubmit(submitData);
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="inventory-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose}>×</button>
        <h2>{initialData ? 'Редагувати' : 'Додати інвентар'}</h2>
        
        <div className="form-group">
          <label>Назва *</label>
          <input
            type="text"
            name="inventory_name"
            value={formData.inventory_name}
            onChange={handleChange}
            className={errors.inventory_name ? 'error' : ''}
          />
          {errors.inventory_name && <span className="error-text">{errors.inventory_name}</span>}
        </div>

        <div className="form-group">
          <label>Опис</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Фото</label>
          <input type="file" name="photo" onChange={handleChange} accept="image/*" />
          {errors.photo && <span className="error-text">{errors.photo}</span>}
        </div>

        <div className="form-buttons">
          <button type="button" className="btn-cancel" onClick={onClose}>Скасувати</button>
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Збереження...' : (initialData ? 'Зберегти' : 'Додати')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InventoryForm;