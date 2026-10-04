"use client";
import React, { useState } from 'react';
import styles from './returns.module.css';

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = [
    { name: 'All', count: null },
    { name: 'In Progress', count: 2 },
    { name: 'Approved', count: 1 },
    { name: 'Completed', count: 3 },
    { name: 'Rejected', count: 1 }
  ];

  const returns = [
    {
      id: '#RET-1287',
      orderId: '#ORD-1024',
      date: 'May 24, 2024',
      product: 'Wireless Headphones WH-1001',
      qty: 1,
      price: '₹2,499',
      status: 'In Progress'
    },
    {
      id: '#RET-1286',
      orderId: '#ORD-0985',
      date: 'May 18, 2024',
      product: 'Mechanical Keyboard K2',
      qty: 1,
      price: '₹5,999',
      status: 'Approved'
    },
    {
      id: '#RET-1250',
      orderId: '#ORD-0850',
      date: 'May 02, 2024',
      product: 'Smartphone Case',
      qty: 2,
      price: '₹998',
      status: 'Completed'
    },
    {
      id: '#RET-1241',
      orderId: '#ORD-0812',
      date: 'April 28, 2024',
      product: 'USB-C Cable',
      qty: 1,
      price: '₹499',
      status: 'Rejected'
    }
  ];

  const filteredReturns = activeTab === 'All' ? returns : returns.filter(r => r.status === activeTab);

  const getStatusClass = (status) => {
    switch(status) {
      case 'In Progress': return styles.statusBlue;
      case 'Approved': return styles.statusGreen;
      case 'Completed': return styles.statusPurple;
      case 'Rejected': return styles.statusRed;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>My Returns</h1>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsScroll}>
          {tabs.map(tab => (
            <button 
              key={tab.name}
              className={`${styles.tabBtn} ${activeTab === tab.name ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.name}
              {tab.count !== null && <span className={styles.tabBadge}>{tab.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.returnsList}>
        {filteredReturns.map(ret => (
          <div key={ret.id} className={styles.returnCard}>
            <div className={styles.cardHeader}>
              <div className={styles.headerInfo}>
                <span className={styles.returnId}>Return ID {ret.id}</span>
                <span className={styles.dot}>•</span>
                <span className={styles.orderId}>Order {ret.orderId}</span>
                <span className={styles.dot}>•</span>
                <span className={styles.date}>{ret.date}</span>
              </div>
              <span className={`${styles.statusBadge} ${getStatusClass(ret.status)}`}>
                {ret.status}
              </span>
            </div>

            <div className={styles.productInfo}>
              <div className={styles.productImage}>📦</div>
              <div className={styles.productDetails}>
                <h4 className={styles.productName}>{ret.product}</h4>
                <p className={styles.productMeta}>Qty: {ret.qty} • {ret.price}</p>
              </div>
              <div className={styles.cardActions}>
                <a href="#" className={styles.viewLink}>View Details →</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
