import { useEffect, useState } from 'react'
import axios from 'axios'
import './analytics.css'

const url = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:4000'
  : window.location.origin

const Analytics = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${url}/api/order/analytics`)
      if (res.data.success) setData(res.data.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAnalytics() }, [])

  if (loading) return <div className="analytics-page"><div className="loading-text">Loading analytics...</div></div>
  if (!data) return <div className="analytics-page"><div className="loading-text">Failed to load data.</div></div>

  const maxRevenue = Math.max(...(data.dailyOrders || []).map(d => d.revenue), 1)
  const maxCount = Math.max(...(data.dailyOrders || []).map(d => d.count), 1)

  return (
    <div className="analytics-page">
      <h1>📊 Analytics Dashboard</h1>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(252,128,25,0.12)', color: '#FC8019' }}>🧾</div>
          <div>
            <div className="kpi-value">{data.totalOrders}</div>
            <div className="kpi-label">Total Orders</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(96,178,70,0.12)', color: '#60B246' }}>✅</div>
          <div>
            <div className="kpi-value">{data.paidOrders}</div>
            <div className="kpi-label">Paid Orders</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366F1' }}>₹</div>
          <div>
            <div className="kpi-value">₹{data.totalRevenue.toLocaleString('en-IN')}</div>
            <div className="kpi-label">Total Revenue</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>📦</div>
          <div>
            <div className="kpi-value">{data.totalOrders - data.paidOrders}</div>
            <div className="kpi-label">Pending Orders</div>
          </div>
        </div>
      </div>

      {/* Revenue Bar Chart */}
      <div className="chart-card">
        <h2>Daily Revenue (Last 7 Days)</h2>
        <div className="bar-chart">
          {data.dailyOrders.length === 0 ? (
            <div className="no-data">No order data for the last 7 days</div>
          ) : data.dailyOrders.map((d, i) => (
            <div className="bar-group" key={i}>
              <div className="bar-tooltip">₹{d.revenue.toLocaleString('en-IN')}<br />{d.count} orders</div>
              <div
                className="bar"
                style={{ height: `${Math.max((d.revenue / maxRevenue) * 180, 4)}px` }}
              ></div>
              <div className="bar-label">{d._id.slice(5)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="chart-card">
        <h2>Order Status Breakdown</h2>
        <div className="status-list">
          {data.statusBreakdown.map((s, i) => {
            const total = data.totalOrders || 1
            const pct = Math.round((s.count / total) * 100)
            return (
              <div className="status-row" key={i}>
                <div className="status-name">{s._id}</div>
                <div className="status-bar-track">
                  <div className="status-bar-fill" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="status-count">{s.count}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Analytics
