import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

const stats = [
  { label: 'Total Products', value: '—', icon: Package, color: 'text-primary' },
  { label: 'Pending Orders', value: '—', icon: ShoppingCart, color: 'text-accent' },
  { label: 'Total Users', value: '—', icon: Users, color: 'text-text' },
  { label: 'Revenue', value: '—', icon: DollarSign, color: 'text-success' },
];

const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface rounded p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <stat.icon size={20} className={`sm:hidden ${stat.color}`} />
              <stat.icon size={24} className={`hidden sm:block ${stat.color}`} />
            </div>
            <p className="text-lg sm:text-2xl font-serif font-bold">{stat.value}</p>
            <p className="text-xs sm:text-sm text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded p-4 sm:p-6">
        <h3 className="font-serif text-base sm:text-lg mb-4">Recent Activity</h3>
        <p className="text-xs sm:text-sm text-text-muted">
          Connect to your MongoDB database to see live analytics and sales data.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
