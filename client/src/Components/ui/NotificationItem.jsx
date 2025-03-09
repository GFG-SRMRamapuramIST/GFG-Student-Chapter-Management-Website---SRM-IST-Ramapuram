import { motion } from 'framer-motion';
import { MdAccessTime } from 'react-icons/md';
import { RiLinkM } from 'react-icons/ri';

const NotificationItem = ({ notification }) => {
  const { title, description, datetime, links } = notification;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow"
    >
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600 mb-3">{description}</p>
      
      {datetime && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <MdAccessTime />
          <time>{new Date(datetime).toLocaleString()}</time>
        </div>
      )}

      {links && links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm hover:bg-green-100 transition-colors"
            >
              <RiLinkM  className="w-4 h-4 mr-1" />
              {link.placeholder}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default NotificationItem;