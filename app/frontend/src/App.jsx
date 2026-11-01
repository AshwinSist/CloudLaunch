
import { useEffect, useState } from 'react'
import './App.css'

const navigation = [
  { icon: '⌂', label: 'Dashboard' },
  { icon: '🚀', label: 'Deployments' },
  { icon: '▱', label: 'Infrastructure' },
  { icon: '♢', label: 'Security' },
  { icon: '▥', label: 'Cost Management' },
  { icon: '⌁', label: 'Monitoring' },
  { icon: '⚙', label: 'Settings' },
]

function App() {
  const [dashboardData, setDashboardData] = useState(null)
  const [apiStatus, setApiStatus] = useState('Connecting')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchDashboard() {
      try {
        const response = await fetch('/api/dashboard', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Backend request failed')
        }

        const data = await response.json()
        setDashboardData(data)
        setApiStatus('Connected')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setApiStatus('Disconnected')
          console.error('Dashboard API error:', error)
        }
      }
    }

    fetchDashboard()

    return () => controller.abort()
  }, [])

  const statistics = [
    {
      icon: '🚀',
      label: 'Total Deployments',
      value: dashboardData?.total_deployments ?? '—',
      description: 'Deployment history',
      color: 'blue',
    },
    {
      icon: '✓',
      label: 'Successful Deployments',
      value: dashboardData?.successful_deployments ?? '—',
      description: 'Successfully released',
      color: 'green',
    },
    {
      icon: '♢',
      label: 'Security Issues',
      value: dashboardData?.security_issues ?? '—',
      description: 'Scan findings',
      color: 'red',
    },
    {
      icon: '▤',
      label: 'Estimated Cloud Cost',
      value: dashboardData
        ? `$${Number(dashboardData.estimated_cloud_cost).toFixed(2)}`
        : '—',
      description: 'Cost overview',
      color: 'orange',
    },
  ]

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">☁</div>
          <div>
            <h2>CloudLaunch</h2>
            <p>BUILD. DEPLOY. SCALE.</p>
          </div>
        </div>

        <div className="nav-heading">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map((item, index) => (
            <div
              className={`nav-item ${index === 0 ? 'active' : ''}`}
              key={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {index === 0 && <span className="active-dot" />}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="aws-card">
            <div className="aws-card-icon">☁</div>
            <h3>AWS Cloud</h3>
            <span className="offline">● Not Connected</span>
            <p>Connect your cloud account to get started.</p>
          </div>
          <p className="version">CloudLaunch v1.0</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>Dashboard</strong>
          </div>

          <div className="topbar-right">
            <div className="environment">
              <span className="environment-dot" />
              {dashboardData?.environment ?? 'Development'}
            </div>
            <div className="notification">♧</div>
            <div className="avatar">A</div>
          </div>
        </header>

        <section className="welcome-banner">
          <div className="welcome-text">
            <span className="welcome-tag">YOUR CLOUD CONTROL CENTER</span>
            <h1>Welcome to CloudLaunch!</h1>
            <p>
              Your unified platform to deploy, secure, and manage
              cloud infrastructure.
            </p>
            <div className="welcome-status">
              <span className="status-dot" />
              {apiStatus === 'Connected'
                ? 'Backend connection established'
                : apiStatus === 'Connecting'
                  ? 'Connecting to backend...'
                  : 'Backend connection unavailable'}
            </div>
          </div>
          <div className="welcome-illustration">🚀</div>
          <div className="banner-orbit orbit-one" />
          <div className="banner-orbit orbit-two" />
        </section>

        <section className="section-heading">
          <div>
            <h2>Platform Overview</h2>
            <p>Here's what's happening across your platform.</p>
          </div>
          <span className="demo-label">
            {dashboardData ? 'API DATA' : 'WAITING FOR DATA'}
          </span>
        </section>

        <section className="stats">
          {statistics.map((stat) => (
            <div className={`stat-card ${stat.color}`} key={stat.label}>
              <div className="stat-top">
                <span>{stat.label}</span>
                <div className="stat-icon">{stat.icon}</div>
              </div>
              <h2>{stat.value}</h2>
              <p>{stat.description}</p>
            </div>
          ))}
        </section>

        <section className="section-heading">
          <div>
            <h2>Manage Your Cloud</h2>
            <p>Monitor deployments and manage your infrastructure.</p>
          </div>
        </section>

        <section className="middle-grid">
          <div className="panel deployment-panel">
            <div className="panel-heading">
              <h3>🚀 Deployment Overview</h3>
              <span className="panel-menu">•••</span>
            </div>
            <div className="empty-state">
              <div className="empty-icon">☁</div>
              <h3>No deployments yet</h3>
              <p>Your deployment history will appear here.</p>
            </div>
          </div>

          <div className="panel aws-panel">
            <div className="panel-heading">
              <h3>☁ Infrastructure Status</h3>
              <span className="panel-menu">•••</span>
            </div>
            <div className="aws-content">
              <div className="aws-logo">aws</div>
              <h3>Connect to AWS</h3>
              <p>
                Connect your AWS account to monitor resources
                and infrastructure.
              </p>
              <span className="connect-button">
                Connection coming soon
              </span>
            </div>
          </div>

          <div className="panel actions-panel">
            <div className="panel-heading">
              <h3>⚡ Quick Actions</h3>
            </div>
            <button>🚀 <span>New Deployment</span> <b>›</b></button>
            <button>♢ <span>Security Scan</span> <b>›</b></button>
            <button>▱ <span>View Resources</span> <b>›</b></button>
            <button>▤ <span>Estimate Cost</span> <b>›</b></button>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel activity-panel">
            <div className="panel-heading">
              <h3>◷ Recent Activity</h3>
              <span className="panel-menu">•••</span>
            </div>
            <div className="empty-state">
              <div className="empty-icon">▤</div>
              <h3>No recent activity</h3>
              <p>Pipeline and deployment events will appear here.</p>
            </div>
          </div>

          <div className="panel health-panel">
            <div className="panel-heading">
              <h3>⌁ System Health</h3>
              <span className="demo-label">LIVE API CHECK</span>
            </div>
            <div className="health-items">
              <div>
                <span className="health-icon">▣</span>
                <h4>Frontend</h4>
                <small className="online">● Running locally</small>
              </div>
              <div>
                <span className="health-icon">&lt;/&gt;</span>
                <h4>Backend API</h4>
                <small className={apiStatus === 'Connected' ? 'online' : 'offline'}>
                  ● {apiStatus}
                </small>
              </div>
              <div>
                <span className="health-icon">☁</span>
                <h4>AWS Cloud</h4>
                <small className="offline">
                  ● {dashboardData?.aws_connected ? 'Connected' : 'Not Connected'}
                </small>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          CloudLaunch © 2026
          <span>Built for secure cloud deployments.</span>
        </footer>
      </main>
    </div>
  )
}

export default App
