"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BiteBaseLogo from "../BiteBaseLogo";

export default function StunningLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div style={{ 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(116, 195, 99, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)
        `,
        zIndex: -2,
        transition: 'background 0.3s ease'
      }} />

      {/* Floating Particles */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              background: `rgba(116, 195, 99, ${Math.random() * 0.5 + 0.2})`,
              borderRadius: '50%',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
              animationDelay: Math.random() * 2 + 's'
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrollY > 50 ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        transition: 'all 0.3s ease',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px'
        }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'white'
          }}>
            <BiteBaseLogo size="sm" showText={true} variant="white" />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <a href="#features" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s ease' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#74c363'}
               onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
              Features
            </a>
            <Link href="/blog" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s ease' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#74c363'}
               onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
              Blog
            </Link>
            <a href="#pricing" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.3s ease' }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#74c363'}
               onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
              Pricing
            </a>
            <Link href="/dashboard">
              <button style={{
                background: 'linear-gradient(135deg, #74c363, #5fa854)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '50px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(116, 195, 99, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(116, 195, 99, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(116, 195, 99, 0.3)';
              }}>
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '80px 40px 0 40px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '1000px',
          transform: `translateY(${scrollY * 0.1}px)`,
          transition: 'transform 0.1s ease-out'
        }}>
          {/* Animated Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(116, 195, 99, 0.1)',
            border: '1px solid rgba(116, 195, 99, 0.3)',
            borderRadius: '50px',
            padding: '8px 20px',
            marginBottom: '30px',
            animation: 'fadeInUp 1s ease-out',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#74c363',
              borderRadius: '50%',
              marginRight: '10px',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ color: '#74c363', fontWeight: '600', fontSize: '14px' }}>
              AI-Powered Restaurant Intelligence
            </span>
          </div>

          {/* Main Heading with Typewriter Effect */}
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: '900',
            lineHeight: '1.1',
            marginBottom: '30px',
            animation: 'fadeInUp 1s ease-out 0.2s both'
          }}>
            <span style={{ color: 'white' }}>Transform Your</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #74c363, #a3e635, #84cc16)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 3s ease infinite'
            }}>
              Restaurant Business
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.4rem',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.6',
            marginBottom: '50px',
            maxWidth: '700px',
            margin: '0 auto 50px auto',
            animation: 'fadeInUp 1s ease-out 0.4s both'
          }}>
            Discover profitable locations, track competitors, and optimize operations with 
            geospatial analytics and AI-driven insights that boost your bottom line.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeInUp 1s ease-out 0.6s both'
          }}>
            <Link href="/dashboard">
              <button style={{
                background: 'linear-gradient(135deg, #74c363, #5fa854)',
                color: 'white',
                border: 'none',
                padding: '20px 40px',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(116, 195, 99, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(116, 195, 99, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(116, 195, 99, 0.4)';
              }}>
                <span style={{ position: 'relative', zIndex: 1 }}>🚀 Start Free Trial</span>
              </button>
            </Link>
            
            <button style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '18px 38px',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = '#74c363';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              ▶️ Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '60px',
            marginTop: '80px',
            flexWrap: 'wrap',
            animation: 'fadeInUp 1s ease-out 0.8s both'
          }}>
            {[
              { number: '1000+', label: 'Restaurants Served' },
              { number: '25%', label: 'Average Revenue Increase' },
              { number: '99.9%', label: 'Uptime Guarantee' }
            ].map((stat, index) => (
              <div key={index} style={{
                textAlign: 'center',
                animation: `countUp 2s ease-out ${1 + index * 0.2}s both`
              }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #74c363, #a3e635)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '8px'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite'
        }}>
          <div style={{
            width: '2px',
            height: '30px',
            background: 'linear-gradient(to bottom, transparent, #74c363)',
            margin: '0 auto 10px'
          }} />
          <div style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Scroll to explore
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: '120px 40px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(116, 195, 99, 0.1)',
              border: '1px solid rgba(116, 195, 99, 0.3)',
              borderRadius: '25px',
              padding: '8px 20px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ color: '#74c363', fontWeight: '600', fontSize: '14px' }}>
                ✨ Features
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              color: 'white',
              marginBottom: '20px'
            }}>
              Why Choose BiteBase Intelligence
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover how our AI-powered platform helps restaurants optimize operations, 
              understand markets, and increase profitability.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {[
              {
                icon: '🗺️',
                title: 'Geospatial Analytics',
                features: [
                  'Interactive location intelligence maps',
                  'Demographic and foot traffic analysis',
                  'Optimal site selection recommendations',
                  'Trade area visualization and insights'
                ]
              },
              {
                icon: '🧠',
                title: 'AI-Powered Insights',
                features: [
                  'Intelligent competitor analysis',
                  'Predictive sales forecasting',
                  'Automated market research reports',
                  'Strategic recommendations engine'
                ]
              },
              {
                icon: '📊',
                title: 'Business Intelligence',
                features: [
                  'Real-time performance dashboards',
                  'Revenue optimization analytics',
                  'Customer behavior insights',
                  'Operational efficiency metrics'
                ]
              }
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '40px',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.background = 'rgba(116, 195, 99, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(116, 195, 99, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '20px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '20px'
                }}>
                  {feature.title}
                </h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {feature.features.map((item, i) => (
                    <li key={i} style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '12px',
                      paddingLeft: '20px',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#74c363'
                      }}>
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{
        padding: '120px 40px',
        background: 'linear-gradient(135deg, rgba(116, 195, 99, 0.05), rgba(116, 195, 99, 0.02))',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(116, 195, 99, 0.1)',
              border: '1px solid rgba(116, 195, 99, 0.3)',
              borderRadius: '25px',
              padding: '8px 20px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ color: '#74c363', fontWeight: '600', fontSize: '14px' }}>
                💬 Customer Success Stories
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              color: 'white',
              marginBottom: '20px'
            }}>
              Trusted by Restaurant Owners
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              See how BiteBase Intelligence has transformed restaurants across the globe.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {[
              {
                quote: "BiteBase Intelligence helped us identify the perfect location for our second restaurant. The geospatial analytics were spot-on, and we saw a 40% increase in foot traffic compared to our projections.",
                author: "Maria Rodriguez",
                title: "Owner, Sabor Latino",
                location: "Miami, FL",
                avatar: "👩‍🍳"
              },
              {
                quote: "The AI insights are incredible. We discovered our peak hours were different than we thought, optimized our staffing, and reduced costs by 25% while improving customer satisfaction.",
                author: "James Chen",
                title: "Manager, Dragon Palace",
                location: "San Francisco, CA",
                avatar: "👨‍💼"
              },
              {
                quote: "The competitor analysis feature is a game-changer. We can see what's working in our market and adapt our strategy accordingly. Our revenue has grown 35% since using BiteBase.",
                author: "Sarah Johnson",
                title: "CEO, Fresh & Fast",
                location: "Austin, TX",
                avatar: "👩‍💼"
              }
            ].map((testimonial, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '40px',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(116, 195, 99, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(116, 195, 99, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}>
                <div style={{
                  fontSize: '2rem',
                  color: '#74c363',
                  marginBottom: '20px'
                }}>
                  "
                </div>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  marginBottom: '30px',
                  fontStyle: 'italic'
                }}>
                  {testimonial.quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    marginRight: '15px'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div style={{
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      marginBottom: '5px'
                    }}>
                      {testimonial.author}
                    </div>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem'
                    }}>
                      {testimonial.title}
                    </div>
                    <div style={{
                      color: '#74c363',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{
        padding: '120px 40px',
        background: 'rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(116, 195, 99, 0.1)',
              border: '1px solid rgba(116, 195, 99, 0.3)',
              borderRadius: '25px',
              padding: '8px 20px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ color: '#74c363', fontWeight: '600', fontSize: '14px' }}>
                💰 Pricing Plans
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              color: 'white',
              marginBottom: '20px'
            }}>
              Choose Your Plan
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Select a plan that fits your needs and start building with BiteBase today!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'per month',
                description: 'Basic analytics and insights for small businesses',
                features: [
                  'Sales overview, peak hours',
                  'Limited trade area view',
                  'Monitor & receive alerts',
                  'Advanced analytics',
                  'Competitor tracking',
                  'AI insights & recommendations'
                ],
                included: [true, true, true, false, false, false],
                buttonText: 'Get Started',
                popular: false
              },
              {
                name: 'Growth',
                price: '$14.99',
                period: 'per month',
                description: 'For independent restaurants looking to optimize',
                features: [
                  'Analytics Overview Dashboard',
                  'Local Market Snapshot',
                  'Review Monitoring',
                  'Track up to 5 competitors',
                  'Monthly AI business reports',
                  '3-month data history'
                ],
                included: [true, true, true, true, true, true],
                buttonText: 'Subscribe Now',
                popular: true
              },
              {
                name: 'Pro',
                price: '$109',
                period: 'per month',
                description: 'Ideal for restaurants expanding to multiple locations',
                features: [
                  'Advanced Analytics Dashboard',
                  'Extended Market Analysis',
                  'Full Review Suite Integration',
                  'Track up to 15 competitors',
                  'Weekly AI strategy recommendations',
                  '1-year data history retention'
                ],
                included: [true, true, true, true, true, true],
                buttonText: 'Choose Pro',
                popular: false
              },
              {
                name: 'Enterprise',
                price: '$599',
                period: 'per month',
                description: 'Custom solutions for restaurant chains and franchises',
                features: [
                  'Enterprise Analytics Suite',
                  'Multi-location Management',
                  'Custom Integration Support',
                  'Unlimited competitor tracking',
                  'Daily AI strategic insights',
                  'Unlimited data history'
                ],
                included: [true, true, true, true, true, true],
                buttonText: 'Contact Sales',
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} style={{
                background: plan.popular 
                  ? 'linear-gradient(135deg, rgba(116, 195, 99, 0.1), rgba(116, 195, 99, 0.05))'
                  : 'rgba(255, 255, 255, 0.05)',
                border: plan.popular 
                  ? '2px solid #74c363'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '40px',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                transition: 'all 0.3s ease',
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = plan.popular ? 'scale(1.08)' : 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = plan.popular ? 'scale(1.05)' : 'scale(1)';
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #74c363, #5fa854)',
                    color: 'white',
                    padding: '6px 20px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    Most Popular
                  </div>
                )}
                
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '10px'
                  }}>
                    {plan.name}
                  </h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    marginBottom: '20px'
                  }}>
                    {plan.description}
                  </p>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: '900',
                    color: plan.popular ? '#74c363' : 'white',
                    marginBottom: '5px'
                  }}>
                    {plan.price}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px'
                  }}>
                    {plan.period}
                  </div>
                </div>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 30px 0'
                }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px',
                      color: plan.included[i] ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)'
                    }}>
                      <span style={{
                        marginRight: '12px',
                        color: plan.included[i] ? '#74c363' : 'rgba(255, 255, 255, 0.3)'
                      }}>
                        {plan.included[i] ? '✓' : '✗'}
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/dashboard">
                  <button style={{
                    width: '100%',
                    background: plan.popular 
                      ? 'linear-gradient(135deg, #74c363, #5fa854)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: plan.popular ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (plan.popular) {
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(116, 195, 99, 0.4)';
                    } else {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plan.popular) {
                      e.currentTarget.style.boxShadow = 'none';
                    } else {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}>
                    {plan.buttonText}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '120px 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(116, 195, 99, 0.1), rgba(116, 195, 99, 0.05))',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '20px'
          }}>
            Ready to Transform Your Restaurant?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '40px'
          }}>
            Join thousands of restaurants using BiteBase Intelligence to optimize 
            operations and increase profitability.
          </p>
          <Link href="/dashboard">
            <button style={{
              background: 'linear-gradient(135deg, #74c363, #5fa854)',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(116, 195, 99, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(116, 195, 99, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(116, 195, 99, 0.4)';
            }}>
              🚀 Start Your Free Trial Today
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px 40px 40px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <BiteBaseLogo size="sm" showText={true} variant="white" />
          </div>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px'
          }}>
            © 2024 BiteBase Intelligence. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40%, 43% {
            transform: translateX(-50%) translateY(-10px);
          }
          70% {
            transform: translateX(-50%) translateY(-5px);
          }
          90% {
            transform: translateX(-50%) translateY(-2px);
          }
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}