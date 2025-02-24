import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { CgCode, CgTrophy } from "react-icons/cg";
import { IoMailOutline } from "react-icons/io5";
import { GiProgression } from "react-icons/gi";
import { codolioIcon } from "../../Assets";

const ProfileHero = ({ userProfile }) => {
  return (
    <div className="p-2 sm:p-4 md:p-6 font-sans antialiased">
      <div className="bg-white rounded-xl shadow-sm">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between p-4 sm:p-6 md:p-8 bg-emerald-600 text-white rounded-t-xl gap-6">
          {/* Profile Info Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <img
              src={userProfile.profilePic}
              alt={userProfile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-emerald-400 bg-gfg-white flex-shrink-0"
            />
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
                <span className="text-xl sm:text-2xl font-semibold tracking-tight">
                  {userProfile.name}
                </span>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="text-sm text-emerald-100 bg-gfgsc-green px-2 py-1 rounded-full">
                    {userProfile.role}
                  </span>
                  <span className="text-sm text-emerald-100 bg-gfgsc-green px-2 py-1 rounded-full">
                    {userProfile.academic_year}
                  </span>
                </div>
              </div>
              <p className="text-emerald-100 text-sm leading-relaxed max-w-md">
                {userProfile.bio}
              </p>
            </div>
          </div>

          {/* Contact & Social Section */}
          <div className="flex flex-col items-center md:items-end justify-center gap-4">
            <div className="flex items-center gap-1 justify-center">
              <IoMailOutline className="w-5 h-5" />
              <a
                href={`mailto:${userProfile.email}`}
                className="text-sm font-medium break-all"
              >
                {userProfile.email}
              </a>
            </div>

            <div className="flex items-center gap-4">
              {userProfile.social.map(({ platform, url }) => (
                <a
                  key={platform}
                  href={url}
                  className="text-emerald-100 hover:text-white hover:scale-105 transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {platform === "linkedin" && (
                    <FaLinkedin className="w-5 h-5 text-[#0a66c2]" />
                  )}
                  {platform === "codolio" && (
                    <img
                      src={codolioIcon}
                      alt="codolio"
                      className="w-5 h-5"
                    />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <StatCard
              icon={<CgCode />}
              label="Questions Solved"
              value={userProfile.stats.questions}
              trend="+5 this week"
            />
            <StatCard
              icon={<CgTrophy />}
              label="Individual Rank"
              value={`#${userProfile.stats.individualRank}`}
              trend="Top 5%"
            />
            <StatCard
              icon={<GiProgression />}
              label="Previous Rank"
              value={`#${userProfile.stats.previousRank}`}
              trend="Top 15%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }) => (
  <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white flex-shrink-0">
        {React.cloneElement(icon, { className: "w-5 h-5 text-emerald-600" })}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-500">{label}</div>
        <div className="text-xl font-semibold text-gray-900">{value}</div>
        {trend && (
          <div className="text-sm text-emerald-600 font-medium mt-0.5">
            {trend}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ProfileHero;