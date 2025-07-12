"use client"

import React, { useState } from "react"
import { Providers } from "./providers"
import BiteBaseLogo from "../components/BiteBaseLogo"
import Link from "next/link"
import EnhancedPricingCards from "../components/subscription/EnhancedPricingCards"

export default function OfficialHomePage() {
  return (
    <Providers>
      <div className="wrapper" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {/* Navigation */}
        <nav className="navbar">
          <div className="navbar-container" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '0 var(--spacing-lg)',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div className="navbar-brand">
              <Link href="/" aria-label="Home">
                <div className="small-image logo" style={{ display: 'flex', alignItems: 'center' }}>
                  <BiteBaseLogo size="sm" showText={false} />
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '1.2rem', 
                    fontWeight: '700',
                    color: 'var(--accent-color)'
                  }}>
                    BiteBase Explorer
                  </span>
                </div>
              </Link>
            </div>

            <div className="navbar-collapse">
              <ul className="navbar-nav" role="menubar" style={{ 
                display: 'flex', 
                listStyle: 'none', 
                margin: 0, 
                padding: 0,
                gap: 'var(--spacing-lg)'
              }}>
                <li role="none" className="nav-item">
                  <a href="#features-section" role="menuitem" className="nav-link">
                    <span className="nav-text">Features</span>
                  </a>
                </li>
                <li role="none" className="nav-item">
                  <a href="#pricing-section" role="menuitem" className="nav-link">
                    <span className="nav-text">Pricing</span>
                  </a>
                </li>
                <li role="none" className="nav-item">
                  <Link href="/blog" role="menuitem" className="nav-link">
                    <span className="nav-text">Blog</span>
                  </Link>
                </li>
                <li role="none" className="nav-item">
                  <Link href="/dashboard" role="menuitem" className="nav-link">
                    <span className="nav-text">Dashboard</span>
                  </Link>
                </li>
                <li role="none" className="nav-item">
                  <Link href="/admin" role="menuitem" className="nav-link">
                    <span className="nav-text">Admin</span>
                  </Link>
                </li>
              </ul>
              
              <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <Link href="/dashboard">
                  <button className="button button-primary button-sm">Get Started</button>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main>
          {/* Hero Section */}
          <section className="hero bg-light py-xl" style={{ padding: 'calc(var(--spacing-xl) + 80px) 0 var(--spacing-xl) 0' }}>
            <div className="container">
              <div className="glass-panel animate-fadeInUp">
                <span className="glass-badge glass-badge-accent mb-md" style={{
                  background: 'var(--contrast-color)',
                  color: '#333',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  display: 'inline-block',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  BiteBase Explorer
                </span>
                <h1 className="mb-sm" style={{ marginBottom: 'var(--spacing-sm)' }}>
                  AI-Powered Restaurant Analytics Platform
                </h1>
                <p className="text-lead mb-lg" style={{ marginBottom: 'var(--spacing-lg)' }}>
                  Transform your restaurant operations with geospatial analytics, competitor insights, 
                  and AI-driven recommendations. Make data-driven decisions that boost profitability.
                </p>
                <div className="mt-lg" style={{ marginTop: 'var(--spacing-lg)' }}>
                  <Link href="/dashboard">
                    <button className="button button-lg" aria-label="Start free trial">
                      <i className="fas fa-rocket"></i>
                      Start Free Trial
                    </button>
                  </Link>
                  <Link href="/price">
                    <button className="button button-secondary button-lg" style={{ marginLeft: '12px' }}>
                      <i className="fas fa-chart-bar"></i>
                      View Pricing
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="section bordered-section" id="features-section" aria-labelledby="features-heading">
            <div className="container">
              <div className="text-center mb-xl">
                <span className="badge badge-primary mb-sm">Features</span>
                <h2 id="features-heading">Why Choose BiteBase Explorer</h2>
                <p className="text-lead mx-auto" style={{ maxWidth: '700px' }}>
                  Discover how our AI-powered platform helps restaurants optimize operations, 
                  understand markets, and increase profitability.
                </p>
              </div>
              
              <div className="overview-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--spacing-lg)',
                marginTop: 'var(--spacing-xl)'
              }}>
                <div className="overview-card translucent-card">
                  <div className="overview-icon" style={{ 
                    fontSize: '2rem', 
                    color: 'var(--accent-color)', 
                    marginBottom: 'var(--spacing-md)' 
                  }}>
                    <i className="fas fa-map-marked-alt"></i>
                  </div>
                  <h3>Geospatial Analytics</h3>
                  <ul className="overview-list" style={{ listStyle: 'none', padding: 0 }}>
                    <li>• Interactive location intelligence maps</li>
                    <li>• Demographic and foot traffic analysis</li>
                    <li>• Optimal site selection recommendations</li>
                    <li>• Trade area visualization and insights</li>
                  </ul>
                </div>
                
                <div className="overview-card translucent-card">
                  <div className="overview-icon" style={{ 
                    fontSize: '2rem', 
                    color: 'var(--accent-color)', 
                    marginBottom: 'var(--spacing-md)' 
                  }}>
                    <i className="fas fa-brain"></i>
                  </div>
                  <h3>AI-Powered Insights</h3>
                  <ul className="overview-list" style={{ listStyle: 'none', padding: 0 }}>
                    <li>• Intelligent competitor analysis</li>
                    <li>• Predictive sales forecasting</li>
                    <li>• Automated market research reports</li>
                    <li>• Strategic recommendations engine</li>
                  </ul>
                </div>
                
                <div className="overview-card translucent-card">
                  <div className="overview-icon" style={{ 
                    fontSize: '2rem', 
                    color: 'var(--accent-color)', 
                    marginBottom: 'var(--spacing-md)' 
                  }}>
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h3>Business Intelligence</h3>
                  <ul className="overview-list" style={{ listStyle: 'none', padding: 0 }}>
                    <li>• Real-time performance dashboards</li>
                    <li>• Revenue optimization analytics</li>
                    <li>• Customer behavior insights</li>
                    <li>• Operational efficiency metrics</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <EnhancedPricingCards />

          {/* CTA Section */}
          <section className="section" style={{ 
            background: 'linear-gradient(135deg, var(--accent-color), #5fa854)',
            color: 'white',
            textAlign: 'center'
          }}>
            <div className="container">
              <div className="glass-panel" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h2 style={{ color: 'white', marginBottom: 'var(--spacing-md)' }}>
                  Ready to Transform Your Restaurant?
                </h2>
                <p className="text-lead" style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  marginBottom: 'var(--spacing-lg)',
                  maxWidth: '600px',
                  margin: '0 auto var(--spacing-lg) auto'
                }}>
                  Join thousands of restaurants using BiteBase Explorer to optimize 
                  operations and increase profitability.
                </p>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/dashboard">
                    <button className="button button-lg" style={{
                      background: 'white',
                      color: 'var(--accent-color)',
                      fontWeight: 'bold'
                    }}>
                      Start Free Trial
                    </button>
                  </Link>
                  <Link href="/price">
                    <button className="button button-lg" style={{
                      background: 'transparent',
                      color: 'white',
                      border: '2px solid white'
                    }}>
                      View Pricing
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer style={{ 
          background: '#333', 
          color: 'white', 
          padding: 'var(--spacing-xl) 0',
          textAlign: 'center'
        }}>
          <div className="container">
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <BiteBaseLogo size="sm" showText={false} />
              <span style={{ 
                marginLeft: '8px', 
                fontSize: '1.1rem', 
                fontWeight: '600'
              }}>
                BiteBase Explorer
              </span>
            </div>
            <p style={{ color: '#ccc', fontSize: '14px' }}>
              © 2024 BiteBase Explorer. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Providers>
  )
}