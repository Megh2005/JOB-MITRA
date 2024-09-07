import Link from "next/link";
import React from "react";

const SuccessPage = () => {
  return (
    <div className="text-center p-4 md:p-6">
      <p className="text-2xl text-neutral-content font-bold">
        Payment Successfull!
      </p>
      <div className="my-6">
        <Link href={"/u/my-courses"}>
          <button className="btn btn-secondary">Go to my courses</button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
