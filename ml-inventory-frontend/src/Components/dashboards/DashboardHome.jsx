import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaShoppingCart,
  FaBoxes,
  FaTags,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
} from "react-icons/fa";
import "./dashboardHome.css";
import LoadingSpinner from "../loading/Loading";
import DeliveriesMap from "../deliveries/DeliveriesMap";

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/dashboard-stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getWeeklyTrend = (current, previous) => {
    current = current || 0;
    previous = previous || 0;

    const difference = current - previous;
    let percentage;

    if (previous === 0) {
      percentage = current === 0 ? 0 : 100;
    } else {
      percentage = (difference / previous) * 100;
    }

    const isPositive = difference > 0;
    const isNeutral = difference === 0;

    return {
      percentage: Math.abs(Math.round(percentage)),
      isPositive,
      isNeutral,
      difference,
    };
  };

  const renderTrendIcon = (trend) => {
    if (!trend) return null;
    const Icon = trend.isNeutral
      ? FaEquals
      : trend.isPositive
      ? FaArrowUp
      : FaArrowDown;
    const color = trend.isNeutral
      ? "#6B7280"
      : trend.isPositive
      ? "#10B981"
      : "#EF4444";
    return <Icon className="trend-icon" style={{ color }} />;
  };

  const renderTrendIndicator = (current, previous) => {
    const trend = getWeeklyTrend(current, previous);
    if (!trend) return null;

    return (
      <div className="weekly-trend">
        {renderTrendIcon(trend)}
        <span className="trend-text">
          {trend.isNeutral ? "No change" : `${trend.percentage}%`} vs last week
        </span>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard-container">
      {/* Stats Cards */}
      <div className="stats-container">
        {/* Beneficiaries */}
        <div className="stat-card">
          <h3 className="stat-title top-title">Total Beneficiaries</h3>
          <div className="stat-middle">
            <p className="stat-value">
              {stats?.total_beneficiaries?.toLocaleString() || "0"}
            </p>
            <div className="stat-icon-container">
              <FaUsers className="stat-icon beneficiaries" />
            </div>
          </div>
          <div className="stat-bottom">
            {renderTrendIndicator(
              stats?.current_week_beneficiaries,
              stats?.previous_week_beneficiaries
            )}
          </div>
        </div>

        {/* Orders */}
        <div className="stat-card">
          <h3 className="stat-title top-title">Total Orders</h3>
          <div className="stat-middle">
            <p className="stat-value">
              {stats?.total_orders?.toLocaleString() || "0"}
            </p>
            <div className="stat-icon-container">
              <FaShoppingCart className="stat-icon orders" />
            </div>
          </div>
          <div className="stat-bottom">
            {renderTrendIndicator(
              stats?.current_week_orders,
              stats?.previous_week_orders
            )}
          </div>
        </div>

        {/* Products */}
        <div className="stat-card">
          <h3 className="stat-title top-title">Total Products</h3>
          <div className="stat-middle">
            <p className="stat-value">
              {stats?.total_products?.toLocaleString() || "0"}
            </p>
            <div className="stat-icon-container">
              <FaBoxes className="stat-icon products" />
            </div>
          </div>
          <div className="stat-bottom">
            {renderTrendIndicator(
              stats?.current_week_products,
              stats?.previous_week_products
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="stat-card">
          <h3 className="stat-title top-title">Total Categories</h3>
          <div className="stat-middle">
            <p className="stat-value">
              {stats?.total_categories?.toLocaleString() || "0"}
            </p>
            <div className="stat-icon-container">
              <FaTags className="stat-icon categories" />
            </div>
          </div>
          <div className="stat-bottom">
            {renderTrendIndicator(
              stats?.current_week_categories,
              stats?.previous_week_categories
            )}
          </div>
        </div>
      </div>

      {/* Deliveries Map */}
      <div className="map-section">
        <h2 className="map-title">Distributions Map</h2>
        <DeliveriesMap />
      </div>
    </div>
  );
};

export default DashboardHome;
