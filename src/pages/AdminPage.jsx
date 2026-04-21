import { useState, useEffect } from 'react';
import InventoryTable from '../components/InventoryTable/InventoryTable';
import InventoryForm from '../components/InventoryForm/InventoryForm';
import InventoryModal from '../components/InventoryModal/InventoryModal';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';
import { getInventory, createInventory, updateInventory, updateInventoryPhoto, deleteInventory } from '../services/api';

function AdminPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      setInventory(data);
      setError(null);
    } catch (err) {
      setError('Не вдалося завантажити інвентар');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleCreate = async (formData) => {
    try {
      await createInventory(formData);
      setShowForm(false);
      loadInventory();
    } catch (err) {
      alert('Помилка створення');
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdate = async (formData) => {
    try {
      await updateInventory(selectedItem.id, {
        inventory_name: formData.get('inventory_name'),
        description: formData.get('description'),
      });
      if (formData.get('photo') && formData.get('photo').size > 0) {
        const photoData = new FormData();
        photoData.append('photo', formData.get('photo'));
        await updateInventoryPhoto(selectedItem.id, photoData);
      }
      setShowForm(false);
      setSelectedItem(null);
      setIsEditing(false);
      loadInventory();
    } catch (err) {
      alert('Помилка оновлення');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInventory(selectedItem.id);
      setShowConfirm(false);
      setSelectedItem(null);
      loadInventory();
    } catch (err) {
      alert('Помилка видалення');
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading-spinner">Завантаження...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>📋 Управління інвентарем</h2>
        <button className="btn-add" onClick={() => { setSelectedItem(null); setIsEditing(false); setShowForm(true); }}>
          + Додати позицію
        </button>
      </div>

      <InventoryTable
        items={inventory}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={(item) => { setSelectedItem(item); setShowConfirm(true); }}
      />

      {showForm && (
        <InventoryForm
          onSubmit={isEditing ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setSelectedItem(null); setIsEditing(false); }}
          initialData={isEditing ? selectedItem : null}
        />
      )}

      {showModal && (
        <InventoryModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setSelectedItem(null); }}
          item={selectedItem}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          isOpen={showConfirm}
          onClose={() => { setShowConfirm(false); setSelectedItem(null); }}
          onConfirm={handleDelete}
          title="Підтвердження видалення"
          message={`Ви впевнені, що хочете видалити "${selectedItem?.inventory_name}"?`}
        />
      )}
    </div>
  );
}

export default AdminPage;