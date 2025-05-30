'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart3,
  Plus,
  X,
  Eclipse,
  Ellipsis,
  EllipsisVertical
} from 'lucide-react';

// Menu items configuration
const menuItems = [
  {
    icon: Users,
    href: '/admin/customers',
    color: 'bg-blue-500 hover:bg-blue-600',
    label: 'Customers'
  },
  {
    icon: FileText,
    href: '/admin/projects',
    color: 'bg-green-500 hover:bg-green-600',
    label: 'Projects'
  },
  {
    icon: Home,
    href: '/admin',
    color: 'bg-amber-500 hover:bg-amber-600',
    label: 'Dashboard'
  },
  {
    icon: BarChart3,
    href: '/admin/finance',
    color: 'bg-purple-500 hover:bg-purple-600',
    label: 'Finance'
  },
  {
    icon: FileText,
    href: '/admin/support',
    color: 'bg-rose-500 hover:bg-rose-600',
    label: 'Inquiries'
  },
  {
    icon: Users,
    href: '/admin/employee',
    color: 'bg-teal-500 hover:bg-teal-600',
    label: 'Employees'
  },
  {
    icon: FileText,
    href: '/admin/notifications',
    color: 'bg-orange-500 hover:bg-orange-600',
    label: 'Notifications'
  }];

export function QuickAccessMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed right-3 top-3/4 -translate-y-1/2 z-50">
      {/* Main toggle button */}
      <motion.button
        className={cn(
          "relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg text-white",
          isOpen ? "bg-rose-600" : "bg-primary",
        )}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X size={24} /> : <EllipsisVertical size={24} />}
        </motion.div>
      </motion.button>

      {/* Circular menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overlay to capture clicks outside */}
            <div 
              className="fixed inset-0 bg-black/5  z-40" 
              onClick={toggleMenu}
            />
            
            {/* Menu items */}
            {menuItems.map((item, index) => {
              const startAngle = 140; // Starting angle (30 degrees above horizontal)
              const endAngle = 340; // Ending angle (90 degrees below horizontal)
              const angle = startAngle + (index * (180 / (menuItems.length - 1)));
              const angleInRadians = angle * (Math.PI / 230);
              const radius = 120; // Distance from center
              const x = Math.cos(angleInRadians) * radius;
              const y = Math.sin(angleInRadians) * radius;              
              return (
                <motion.div
                  key={index}
                  className="absolute"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{
                    x,
                    y,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                      delay: 0.03 * index,
                    },
                  }}
                  exit={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0,
                    transition: { duration: 0.2, delay: 0.03 * (menuItems.length - index - 1) },
                  }}
                >
                  <MenuButton item={item} onClick={toggleMenu} />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuButton({ 
  item, 
  onClick 
}: { 
  item: (typeof menuItems)[number], 
  onClick: () => void 
}) {
  const Icon = item.icon;
  
  return (
    <div className="relative group">
      {/* Button with icon */}
      <Link href={item.href}>
        <motion.button
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full shadow-lg text-white",
            item.color,
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
        >
          <Icon size={20} />
        </motion.button>
      </Link>
      {/* Label tooltip */}
      <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <div className="bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {item.label}
        </div>
      </div>
    </div>
  );
}
