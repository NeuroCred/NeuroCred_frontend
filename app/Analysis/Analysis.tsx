"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import './Analysis.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const PercentageDisplay: React.FC = () => {
  // Hardcoded data
  const data = {
    approvalRate: 65,
    rejectionRate: 20,
    pendingRate: 15,
    totalApplications: 150
  };

  const chartData: ChartData<'pie'> = {
    labels: ['Approved', 'Rejected', 'Pending'],
    datasets: [
      {
        data: [
          data.approvalRate,
          data.rejectionRate,
          data.pendingRate
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="percentage-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="title"
        variants={itemVariants}
      >
        Loan Application Statistics
      </motion.h2>

      <div className="statistics-grid">
        <motion.div 
          className="stat-card approved"
          variants={itemVariants}
        >
          <h3>Approval Rate</h3>
          <motion.div
            className="percentage"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {data.approvalRate}%
          </motion.div>
        </motion.div>

        <motion.div 
          className="stat-card rejected"
          variants={itemVariants}
        >
          <h3>Rejection Rate</h3>
          <motion.div
            className="percentage"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {data.rejectionRate}%
          </motion.div>
        </motion.div>

        <motion.div 
          className="stat-card pending"
          variants={itemVariants}
        >
          <h3>Pending Rate</h3>
          <motion.div
            className="percentage"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {data.pendingRate}%
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="chart-container"
        variants={itemVariants}
      >
        <Pie data={chartData} options={chartOptions} />
      </motion.div>

      <motion.div 
        className="total-applications"
        variants={itemVariants}
      >
        <h3>Total Applications</h3>
        <motion.div
          className="number"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {data.totalApplications}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PercentageDisplay;


// "use client"
// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   ChartData
// } from 'chart.js';
// import './Analysis.css';

// // Register ChartJS components
// ChartJS.register(ArcElement, Tooltip, Legend);

// interface PercentageData {
//   approvalRate: number;
//   rejectionRate: number;
//   pendingRate: number;
//   totalApplications: number;
// }

// const PercentageDisplay: React.FC = () => {
//   const [data, setData] = useState<PercentageData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string>('');

//   useEffect(() => {
//     fetchPercentageData();
//   }, []);

//   const fetchPercentageData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:1000/api/loans/statistics', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }

//       const result = await response.json();
//       setData(result);
//     } catch (error) {
//       setError('Failed to load statistics');
//       console.error('Error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const chartData: ChartData<'pie'> = {
//     labels: ['Approved', 'Rejected', 'Pending'],
//     datasets: [
//       {
//         data: data ? [
//           data.approvalRate,
//           data.rejectionRate,
//           data.pendingRate
//         ] : [],
//         backgroundColor: [
//           'rgba(75, 192, 192, 0.8)',
//           'rgba(255, 99, 132, 0.8)',
//           'rgba(255, 206, 86, 0.8)'
//         ],
//         borderColor: [
//           'rgba(75, 192, 192, 1)',
//           'rgba(255, 99, 132, 1)',
//           'rgba(255, 206, 86, 1)'
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'bottom' as const,
//       },
//       tooltip: {
//         callbacks: {
//           label: function(context: any) {
//             return `${context.label}: ${context.raw}%`;
//           }
//         }
//       }
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         when: "beforeChildren",
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: { duration: 0.5 }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="percentage-container loading">
//         <div className="loader"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="percentage-container error">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       className="percentage-container"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       <motion.h2 
//         className="title"
//         variants={itemVariants}
//       >
//         Loan Application Statistics
//       </motion.h2>

//       <div className="statistics-grid">
//         <motion.div 
//           className="stat-card approved"
//           variants={itemVariants}
//         >
//           <h3>Approval Rate</h3>
//           <motion.div
//             className="percentage"
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             {data?.approvalRate}%
//           </motion.div>
//         </motion.div>

//         <motion.div 
//           className="stat-card rejected"
//           variants={itemVariants}
//         >
//           <h3>Rejection Rate</h3>
//           <motion.div
//             className="percentage"
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//           >
//             {data?.rejectionRate}%
//           </motion.div>
//         </motion.div>

//         <motion.div 
//           className="stat-card pending"
//           variants={itemVariants}
//         >
//           <h3>Pending Rate</h3>
//           <motion.div
//             className="percentage"
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//           >
//             {data?.pendingRate}%
//           </motion.div>
//         </motion.div>
//       </div>

//       <motion.div 
//         className="chart-container"
//         variants={itemVariants}
//       >
//         <Pie data={chartData} options={chartOptions} />
//       </motion.div>

//       <motion.div 
//         className="total-applications"
//         variants={itemVariants}
//       >
//         <h3>Total Applications</h3>
//         <motion.div
//           className="number"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//         >
//           {data?.totalApplications}
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default PercentageDisplay;