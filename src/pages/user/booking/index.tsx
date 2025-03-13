import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import styled from 'styled-components';
import { 
  FaCalendarAlt, 
  FaCut, 
  FaUserAlt, 
  FaClock,
  FaArrowRight 
} from 'react-icons/fa';
import ServiceCard from './components/ServiceCard';
import BookingSteps from './components/BookingSteps';
import ServiceSelection from './components/ServiceSelection';
import TimeSelection from './components/TimeSelection';
import BookingSummary from './components/BookingSummary';
import styles from './index.less';

const UserBooking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Animation for page transition
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // 3D hover effect for cards
  const calc = (x: number, y: number) => [
    -(y - window.innerHeight / 2) / 20,
    (x - window.innerWidth / 2) / 20,
    1.1
  ];
  const trans = (x: number, y: number, s: number) => 
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 }
  }));

  return (
    <motion.div 
      className={styles.bookingContainer}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <div className={styles.bookingHeader}>
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Book Your Appointment
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Choose from our premium services and expert staff
        </motion.p>
      </div>

      <BookingSteps currentStep={currentStep} />

      <div className={styles.bookingContent}>
        {currentStep === 1 && (
          <ServiceSelection 
            onSelect={(service) => {
              setSelectedService(service);
              setCurrentStep(2);
            }}
          />
        )}

        {currentStep === 2 && (
          <TimeSelection
            selectedService={selectedService}
            onSelect={(time) => {
              setSelectedTime(time);
              setCurrentStep(3);
            }}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <BookingSummary
            service={selectedService}
            time={selectedTime}
            onConfirm={() => {/* Handle booking confirmation */}}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </div>
    </motion.div>
  );
};

export default UserBooking; 