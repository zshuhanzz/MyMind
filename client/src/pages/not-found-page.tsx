import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/button';
import { ROUTES } from '../config/routes';

export default function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-warmgray-50 p-4"
    >
      <div className="text-center">
        <p className="text-6xl mb-4">🌫️</p>
        <h1 className="text-2xl font-heading font-bold text-warmgray-900 mb-2">
          Looks like you've wandered off the path
        </h1>
        <p className="text-warmgray-500 mb-8">
          That's okay — let's get you back somewhere familiar.
        </p>
        <Link to={ROUTES.DASHBOARD}>
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </motion.div>
  );
}
