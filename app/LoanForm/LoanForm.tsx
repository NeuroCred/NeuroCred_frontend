"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import './LoanForm.css';

interface LoanFormData {
  no_of_dependents: number;
  education: string;
  self_employed: boolean;
  income_annum: number;
  loan_amount: number;
  loan_term: number;
  cibil_score: number;
  date_of_birth: string;
}

interface ValidationErrors {
  no_of_dependents?: string;
  education?: string;
  income_annum?: string;
  loan_amount?: string;
  loan_term?: string;
  cibil_score?: string;
  date_of_birth?: string;
}

const LoanApplicationForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoanFormData>({
    no_of_dependents: 0,
    education: '',
    self_employed: false,
    income_annum: 0,
    loan_amount: 0,
    loan_term: 0,
    cibil_score: 0,
    date_of_birth: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const educationOptions = [
    'Not Graduate',
    'Graduate',
    'Post Graduate',
    'Professional'
  ];

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/Login');
    }
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const currentDate = new Date();
    const birthDate = new Date(formData.date_of_birth);
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    // Date of Birth validation
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    } else if (age < 18) {
      newErrors.date_of_birth = 'You must be at least 18 years old';
    }

    // Number of dependents validation
    if (formData.no_of_dependents < 0) {
      newErrors.no_of_dependents = 'Number of dependents cannot be negative';
    }

    // Education validation
    if (!formData.education) {
      newErrors.education = 'Education is required';
    }

    // Income validation
    if (formData.income_annum < 100000) {
      newErrors.income_annum = 'Annual income must be at least ₹1,00,000';
    }

    // Loan amount validation
    if (formData.loan_amount < 10000) {
      newErrors.loan_amount = 'Loan amount must be at least ₹10,000';
    }

    // Loan term validation
    if (formData.loan_term < 6 || formData.loan_term > 84) {
      newErrors.loan_term = 'Loan term must be between 6 and 84 months';
    }

    // CIBIL score validation
    if (formData.cibil_score < 300 || formData.cibil_score > 900) {
      newErrors.cibil_score = 'CIBIL score must be between 300 and 900';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Please login to submit loan application');
        }

        const response = await fetch('http://localhost:1000/api/loans/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitStatus({
            success: true,
            message: 'Loan application submitted successfully!'
          });
          
          // Reset form after successful submission
          setFormData({
            no_of_dependents: 0,
            education: '',
            self_employed: false,
            income_annum: 0,
            loan_amount: 0,
            loan_term: 0,
            cibil_score: 0,
            date_of_birth: '',
          });

          // Redirect to success page after 2 seconds
          setTimeout(() => {
            router.push('/loan-status');
          }, 2000);
        } else {
          throw new Error(data.message || 'Failed to submit loan application');
        }
      } catch (error: any) {
        setSubmitStatus({
          success: false,
          message: error.message || 'An error occurred while submitting the application'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? Number(value) 
          : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <motion.div 
      className="loan-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="loan-form">
        <h2>Loan Application</h2>

        {submitStatus.message && (
          <div className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
            {submitStatus.message}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth*</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            className={errors.date_of_birth ? 'error' : ''}
            required
          />
          {errors.date_of_birth && (
            <span className="error-message">{errors.date_of_birth}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="no_of_dependents">Number of Dependents*</label>
          <input
            type="number"
            id="no_of_dependents"
            name="no_of_dependents"
            value={formData.no_of_dependents}
            onChange={handleInputChange}
            min="0"
            max="10"
            className={errors.no_of_dependents ? 'error' : ''}
            required
          />
          {errors.no_of_dependents && (
            <span className="error-message">{errors.no_of_dependents}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="education">Education*</label>
          <select
            id="education"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            className={errors.education ? 'error' : ''}
            required
          >
            <option value="">Select Education</option>
            {educationOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.education && (
            <span className="error-message">{errors.education}</span>
          )}
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="self_employed"
              checked={formData.self_employed}
              onChange={handleInputChange}
            />
            Self Employed
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="income_annum">Annual Income (₹)*</label>
          <input
            type="number"
            id="income_annum"
            name="income_annum"
            value={formData.income_annum}
            onChange={handleInputChange}
            min="100000"
            className={errors.income_annum ? 'error' : ''}
            required
          />
          {errors.income_annum && (
            <span className="error-message">{errors.income_annum}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="loan_amount">Loan Amount (₹)*</label>
          <input
            type="number"
            id="loan_amount"
            name="loan_amount"
            value={formData.loan_amount}
            onChange={handleInputChange}
            min="10000"
            className={errors.loan_amount ? 'error' : ''}
            required
          />
          {errors.loan_amount && (
            <span className="error-message">{errors.loan_amount}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="loan_term">Loan Term (months)*</label>
          <input
            type="number"
            id="loan_term"
            name="loan_term"
            value={formData.loan_term}
            onChange={handleInputChange}
            min="6"
            max="84"
            className={errors.loan_term ? 'error' : ''}
            required
          />
          {errors.loan_term && (
            <span className="error-message">{errors.loan_term}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cibil_score">CIBIL Score*</label>
          <input
            type="number"
            id="cibil_score"
            name="cibil_score"
            value={formData.cibil_score}
            onChange={handleInputChange}
            min="300"
            max="900"
            className={errors.cibil_score ? 'error' : ''}
            required
          />
          {errors.cibil_score && (
            <span className="error-message">{errors.cibil_score}</span>
          )}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default LoanApplicationForm;