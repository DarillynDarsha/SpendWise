import './Sidebar.css'

function Sidebar({ activePage, setActivePage, onLogout }) {

  const menuItems = [
    { name: 'Dashboard', icon: '▦' },
    { name: 'Transactions', icon: '⇄' },
    { name: 'Budgets', icon: '◎' },
    { name: 'Reports', icon: '▥' },
    { name: 'Profile', icon: '♙' }
  ]

  return (
    <aside className="sidebar">

      {/* Brand Logo */}
      <div className="sidebar-header">

        <div className="brand-logo">

          <div className="brand-icon">
            <span>S</span>
          </div>

          <div className="brand-text">
            <h2>Spend<span>Wise</span></h2>
            <p>PERSONAL FINANCE</p>
          </div>

        </div>

      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">

        <p className="menu-heading">MAIN MENU</p>

        {menuItems.map(item => (

          <button
            key={item.name}
            className={`menu-item ${activePage === item.name ? 'active' : ''}`}
            onClick={() => setActivePage(item.name)}
          >

            <span className="menu-icon">{item.icon}</span>

            <span>{item.name}</span>

            {activePage === item.name && (
              <span className="active-indicator"></span>
            )}

          </button>

        ))}

      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">

        <div className="sidebar-divider"></div>

        <button
          className="menu-item logout-btn"
          onClick={onLogout}
        >

          <span className="menu-icon">↪</span>

          <span>Logout</span>

        </button>

        <div className="sidebar-footer">
          <p>SpendWise v1.0</p>
          <span>Manage your money wisely.</span>
        </div>

      </div>

    </aside>
  )
}

export default Sidebar