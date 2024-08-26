'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversationContext } from '@/app/ConversationContext';
import History from '@/components/history';
import { useAuth } from '@/app/authProvider';

const Sidebar: React.FC = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useConversationContext();
  const { isAuthenticated } = useAuth();

  const sidebarVariants = {
    open: {
      width: '20%',
      minWidth: '350px',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    closed: {
      width: 0,
      minWidth: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const contentVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.1, duration: 0.2 },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background bg-opacity-50 z-40 lg:hidden max-w-[350px] "
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isSidebarOpen ? 'open' : 'closed'}
        className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-background overflow-hidden z-50 lg:relative lg:top-0 lg:h-full border-r ${
          isSidebarOpen ? ' w-max-[350px]' : ''
        }`}
      >
        <motion.div
          variants={contentVariants}
          initial="closed"
          animate={isSidebarOpen ? 'open' : 'closed'}
          className="p-2 h-full"
        >
          <History />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Sidebar;
