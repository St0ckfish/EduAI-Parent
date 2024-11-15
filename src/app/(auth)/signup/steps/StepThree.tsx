import Image from "next/image";
import Link from "next/link";
import React from "react";
import Button from "~/_components/Button";
import Input from "~/_components/Input";

type StepOneProps = {
  nextStep: () => void;
  prevStep: () => void;
};

const StepOne: React.FC<StepOneProps> = ({ nextStep, prevStep }) => {
  const stepsDescription = [
    "Location & School",
    "Personal Details 1",
    "Personal Details 2",
    "Authentication",
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-bgSecondary duration-300 ease-in">
      <div className="absolute left-4 top-4 md:left-8 md:top-8">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={150}
            height={40}
            className="w-[120px] md:w-[150px]"
          />
        </Link>
      </div>
      <div className="flex w-full max-w-lg flex-col items-center p-4 md:p-8">
        <h1 className="mb-6 text-3xl font-bold text-black md:text-4xl">
          Sign Up
        </h1>

        {/* Steps */}
        <div className="mb-20 flex w-full items-center justify-between">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                    index < 3 ? "bg-primary" : "bg-gray-300"
                  } font-bold text-white`}
                >
                  {step}
                  <span className="absolute -left-[15px] top-10 w-[100px] text-[10px] text-black sm:left-[-22px] sm:w-[120px] sm:text-xs">
                    {stepsDescription[index]}
                  </span>{" "}
                </div>
                {index < 3 && (
                  <hr className="h-[5px] w-20 bg-primary sm:w-[105px]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <form className="w-full space-y-4">
          <label htmlFor="username">
            <Input placeholder="Username" className="w-full" />
          </label>
          <label htmlFor="email">
            <Input placeholder="E-mail" className="w-full" />
          </label>
          <label htmlFor="password">
            <Input placeholder="Password" type="password" className="w-full" />
          </label>
          <label htmlFor="confirm-password">
            <Input
              placeholder="Confirm password"
              type="password"
              className="w-full"
            />
          </label>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <Button
              type="button"
              onClick={prevStep}
              className="w-1/2 rounded-lg border border-primary bg-bgSecondary py-2 text-lg font-bold text-primary transition hover:bg-gray-200"
            >
              Prev
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="hover:bg-primary-dark w-1/2 rounded-lg bg-primary py-2 text-lg font-bold text-white transition"
            >
              Next
            </Button>
          </div>

          {/* Sign-in Prompt */}
          <div className="mt-6 flex items-center justify-center space-x-2">
            <p className="text-sm text-gray-500">Already have an account?</p>
            <Link
              href="/login"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepOne;
