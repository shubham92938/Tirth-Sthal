import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  FaMapMarkerAlt,
  FaHeart,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaPlaceOfWorship,
  FaUsers,
} from 'react-icons/fa';
import { MdTempleHindu } from 'react-icons/md';
import Navbar from '../../components/common/Navbar';
import '../../styles/pages/districts.css';

import templesData from '../../data/temple';

const ITEMS_PER_PAGE = 8;

const Districts = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');

  const districtName = 'Ujjain';
  const stateName = 'Maharashtra';

  const districtTemples = useMemo(() => {
    let filtered = templesData.filter(
      (item) =>
        item.district?.toLowerCase().includes(districtName.toLowerCase())
    );

    if (search.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [search, sortBy]);

  const totalPages = Math.ceil(districtTemples.length / ITEMS_PER_PAGE);

  const currentTemples = districtTemples.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const districts = [
    'Ahmednagar',
    'Akola',
    'Amravati',
    'Aurangabad',
    'Beed',
    'Bhandara',
    'Buldhana',
    'Chandrapur',
    'Dhule',
    'Ujjain',
    'Jalgaon',
    'Kolhapur',
    'Latur',
    'Mumbai City',
    'Nagpur',
  ];

  return (
    <div className="district-page">
      <Navbar />

      <div className="district-layout">
        <aside className="district-sidebar">
          <h3>🏛 Districts in Maharashtra</h3>

          <div className="district-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="district-list">
            {districts.map((district, index) => (
              <button
                key={index}
                className={`district-item ${
                  district === districtName ? 'active' : ''
                }`}
              >
                <span>{district}</span>
                <span className="count">
                  {Math.floor(Math.random() * 600 + 90)}
                </span>
              </button>
            ))}
          </div>

          <button className="view-all-btn">View All Districts</button>
        </aside>

        <main className="district-content">
          <div className="breadcrumb">
            Home / Maharashtra / Ujjain District
          </div>

          <div className="district-hero">
            <div>
              <h1>Ujjain District, Maharashtra</h1>
              <p>
                Explore {districtTemples.length} temples in Ujjain district.
                Discover ancient temples, spiritual places and seek blessings.
              </p>
            </div>

            <div className="hero-bg"></div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <MdTempleHindu className="stat-icon" />
              <div>
                <h2>
                  <CountUp end={districtTemples.length} duration={2} />
                </h2>
                <p>Total Temples</p>
              </div>
            </div>

            <div className="stat-card">
              <FaPlaceOfWorship className="stat-icon" />
              <div>
                <h2>8</h2>
                <p>Tehsils</p>
              </div>
            </div>

            <div className="stat-card">
              <FaMapMarkerAlt className="stat-icon" />
              <div>
                <h2>1,234</h2>
                <p>Villages Covered</p>
              </div>
            </div>

            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div>
                <h2>58K+</h2>
                <p>Devotees Visited</p>
              </div>
            </div>

            <select
              className="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="rating">Sort by: Rating</option>
              <option value="name">Sort by: Name</option>
            </select>
          </div>

          <div className="temples-grid">
            {currentTemples.map((temple, index) => (
              <motion.div
                key={temple.id}
                className="temple-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="temple-image-wrapper">
                  <img src={temple.image} alt={temple.name} />

                  <button className="favorite-btn">
                    <FaHeart />
                  </button>
                </div>

                <div className="temple-card-content">
                  <h3>{temple.name}</h3>

                  <span className="temple-tag">
                    {temple.category || 'Ancient Temple'}
                  </span>

                  <p className="location">
                    <FaMapMarkerAlt />
                    {temple.location || 'Ujjain City'}
                  </p>

                  <button className="details-btn">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <FaChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <FaChevronRight />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Districts;
```