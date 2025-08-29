interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  color = 'blue' 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  }

  const changeClasses = {
    increase: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900',
    decrease: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900',
    neutral: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-300 ${changeClasses[changeType]}`}>
                {changeType === 'increase' && '↗️'}
                {changeType === 'decrease' && '↘️'}
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]} bg-opacity-10 dark:bg-opacity-20 transition-all duration-300`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )
}