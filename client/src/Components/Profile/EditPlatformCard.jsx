import { RiVerifiedBadgeFill } from 'react-icons/ri';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';

const EditPlatformCard = ({
  platform,
  icon: Icon,
  iconColor,
  username,
  verified,
  loading,
  children,
  onVerifyClick
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
      <div className="flex items-center space-x-3 mb-3">
        {Icon && <Icon className={`text-[${iconColor}] text-2xl`} />}
        <label className="font-medium text-gray-800">{platform}</label>
        {username && (
          verified ? (
            <RiVerifiedBadgeFill className="text-green-500" />
          ) : (
            <button
              onClick={() => onVerifyClick(platform, username)}
              className="text-xs text-blue-500 hover:text-blue-600"
            >
              Verify
            </button>
          )
        )}
      </div>
      <div className="space-y-2">
        {loading ? (
          <FaSpinner className="animate-spin inline-block" />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

EditPlatformCard.propTypes = {
  platform: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  iconColor: PropTypes.string.isRequired,
  username: PropTypes.string,
  verified: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onVerifyClick: PropTypes.func.isRequired,
};

export default EditPlatformCard;