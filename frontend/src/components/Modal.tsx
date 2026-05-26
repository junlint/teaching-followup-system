import React from 'react'

export function Modal({
  open, title, children, onClose
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null
  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()}>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="h2">{title}</div>
          <div className="spacer" />
          <button className="btn" onClick={onClose}>关闭</button>
        </div>
        <hr className="sep" />
        {children}
      </div>
    </div>
  )
}

export function Drawer({
  open, title, children, onClose
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null
  return (
    <div className="drawerOverlay" onMouseDown={onClose}>
      <div className="drawer" onMouseDown={e => e.stopPropagation()}>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="h2">{title}</div>
          <div className="spacer" />
          <button className="btn" onClick={onClose}>关闭</button>
        </div>
        <hr className="sep" />
        {children}
      </div>
    </div>
  )
}
