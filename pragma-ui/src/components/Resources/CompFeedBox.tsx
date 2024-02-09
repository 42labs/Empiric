import React from "react";
import styles from "./styles.module.scss";
import { ButtonLink } from "../common/Button";
import GreenText from "../common/GreenText";

const CompFeedBox = () => {
  return (
    <div className={styles.darkGreenBoxBis}>
      <div className="my-auto w-10/12 items-center">
        <h2 className="mb-4 text-lightGreen">Computational Feeds</h2>
        <GreenText isAligned={false} className="mb-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing , sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat.
        </GreenText>
        <ButtonLink
          variant="outline"
          color="mint"
          href="/"
          center={false}
          className="w-fit"
        >
          Integrate CF
        </ButtonLink>
      </div>
      <img
        className="items-center align-middle"
        src="/assets/vectors/compFeed.svg"
      />
    </div>
  );
};
export default CompFeedBox;
