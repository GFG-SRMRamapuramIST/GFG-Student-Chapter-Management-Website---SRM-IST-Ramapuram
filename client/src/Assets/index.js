const defaulfHash = "L00000fQfQfQfQfQfQfQfQfQfQfQ";

// This file will act as single source for importing all the modules/files of this folder and will hence used as a single source for exporting

import AakashPfp from "./people/AakashPfp.png";
import SanjanaPfp from "./people/SanjanaPfp.png";
import RachitPfp from "./people/RachitPfp.png";
import AbhishekPfp from "./people/AbhishekPfp.png";

const AakashPic = {
  url: AakashPfp,
  hashCode: "LcG+aZtR.8Vs~qkCtlRPR*s:i^WC",
  alt: "Aakash Kumar",
};

const SanjanaPic = {
  url: SanjanaPfp,
  hashCode: defaulfHash, //TODO: Change this hash
  alt: "Sanjana Jaldu",
};

const RachitPic = {
  url: RachitPfp,
  hashCode: defaulfHash, //TODO: Change this hash
  alt: "Rachit Dhaka",
};

const AbhishekPic = {
  url: AbhishekPfp,
  hashCode: defaulfHash, //TODO: Change this hash
  alt: "Abhishek Newase",
};

// export { AakashPfp, SanjanaPfp, RachitPfp, AbhishekPfp };
export { AakashPic, SanjanaPic, RachitPic, AbhishekPic };

// Icons & Logo
import codolioIcon from "./icons/codolio.svg";
import codolioBWIcon from "./icons/codolioBW.svg";
import logo from "./icons/logo.png";
import GfgCoin from "./icons/GreenCoin.svg";

export { codolioIcon, logo, codolioBWIcon, GfgCoin };

// Events Images
import GeekFest from "./events/GeekFest.png";
import HalloweenHangout from "./events/HalloweenHangout.jpg";
import OnboardingMeeting from "./events/OnboardingMeeting.jpg";

const GeekFestImg = {
  url: GeekFest,
  hashCode: defaulfHash,
  alt: "GeekFest",
};

const HalloweenHangoutImg = {
  url: HalloweenHangout,
  hashCode: defaulfHash,
  alt: "Halloween Hangout",
};

const OnboardingMeetingImg = {
  url: OnboardingMeeting,
  hashCode: defaulfHash,
  alt: "Onboarding Meeting",
};

export { GeekFestImg, HalloweenHangoutImg, OnboardingMeetingImg };
