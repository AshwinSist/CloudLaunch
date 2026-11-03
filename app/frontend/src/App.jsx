
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

  const awsConnected = dashboardData?.aws_connected === true

  const statistics = [
    {
      icon: '☁',
      label: 'Total EC2 Instances',
      value: dashboardData?.total_ec2_instances ?? '—',
      description: 'Instances in AWS region',
      color: 'blue',
    },
    {
      icon: '✓',
      label: 'Running Instances',
      value: dashboardData?.running_ec2_instances ?? '—',
      description: 'Currently running',
      color: 'green',
    },
    {
      icon: '▱',
      label: 'Stopped Instances',
      value: dashboardData?.stopped_ec2_instances ?? '—',
      description: 'Currently stopped',
      color: 'orange',
    },
    {
      icon: '♢',
      label: 'AWS Connection',
      value: dashboardData ? (awsConnected ? 'Connected' : 'Offline') : '—',
      description: dashboardData?.aws_region ?? 'Checking AWS connection',
      color: awsConnected ? 'green' : 'red',
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
            <span className={awsConnected ? 'online' : 'offline'}>
              ● {awsConnected ? 'Connected' : 'Not Connected'}
            </span>
            <p>
              {awsConnected
                ? `Live AWS monitoring · ${dashboardData.aws_region}`
                : 'AWS connection is currently unavailable.'}
            </p>
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
              {dashboardData?.environment ?? 'Loading'}
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
            <h2>AWS Infrastructure Overview</h2>
            <p>Live EC2 information retrieved from your AWS account.</p>
          </div>
          <span className="demo-label">
            {dashboardData ? 'LIVE AWS DATA' : 'WAITING FOR DATA'}
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
              <h3>Deployment history unavailable</h3>
              <p>GitHub Actions integration is not connected yet.</p>
            </div>
          </div>

          <div className="panel aws-panel">
            <div className="panel-heading">
              <h3>☁ Infrastructure Status</h3>
              <span className="panel-menu">•••</span>
            </div>
            <div className="aws-content">
              <div className="aws-logo">aws</div>
              <h3>{awsConnected ? 'AWS Connected' : 'AWS Unavailable'}</h3>
              <p>
                {awsConnected
                  ? `${dashboardData.total_ec2_instances} EC2 instance(s) found in ${dashboardData.aws_region}.`
                  : dashboardData?.aws_error ?? 'Waiting for AWS connection.'}
              </p>
              <span className="connect-button">
                {awsConnected ? 'Live connection active' : 'Connection unavailable'}
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
              <h3>Activity tracking unavailable</h3>
              <p>Pipeline and deployment events are not integrated yet.</p>
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
                <small className="online">● Running</small>
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
                <small className={awsConnected ? 'online' : 'offline'}>
                  ● {awsConnected ? 'Connected' : 'Not Connected'}
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
