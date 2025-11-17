import HalfStar from "apps/user-ui/src/assets/svgs/half-star";
import StarOutline from "apps/user-ui/src/assets/svgs/star-outline";
import StarFilled from "apps/user-ui/src/assets/svgs/start-filled";
import React, { FC } from "react";

type Props = {
    rating: number; // e.g., 4.5
    maxRating?: number; // optional, default 5
};

const Ratings: FC<Props> = ({ rating, maxRating = 5 }) => {
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
        if (i <= Math.floor(rating)) {
            // full star
            stars.push(<StarFilled key={`star-${i}`} />);
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            // half star
            stars.push(<HalfStar key={`star-${i}`} />);
        } else {
            // empty star
            stars.push(<StarOutline key={`star-${i}`} />);
        }
    }

    return <div className="flex items-center gap-1">{stars}</div>;
};

export default Ratings;
