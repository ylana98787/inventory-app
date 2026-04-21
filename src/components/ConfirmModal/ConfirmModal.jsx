function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>Скасувати</button>
          <button className="btn-delete" onClick={onConfirm}>Видалити</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;