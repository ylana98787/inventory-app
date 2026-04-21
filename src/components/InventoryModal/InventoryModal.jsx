function InventoryModal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="inventory-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <img src={item.photo_url} alt={item.inventory_name} />
        <h2>{item.inventory_name}</h2>
        <p>{item.description || 'Немає опису'}</p>
      </div>
    </div>
  );
}

export default InventoryModal;