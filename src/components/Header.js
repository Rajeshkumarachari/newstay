import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import logo from "/public/bnb.png";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Header() {
  return (
    <header className=" shadow-sm">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-2">
        <Link href="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap gap-2 justify-center">
            <Image src={logo} width={26} height={20} alt="logo" />
            <span className="text-rose-500">rajeshbnb</span>
          </h1>
        </Link>
        <form className=" bg-gray-100 p-3 rounded-full flex items-center ">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none pl-2 "
          />
          <button className="  ">
            <FaSearch className="text-white bg-rose-500 size-7 p-2 rounded-full" />
          </button>
        </form>
        <ul className="flex">
          <Link href="/">
            <li className="hidden md:inline text-slate-700  hover:bg-gray-100 px-3 py-3 rounded-full">
              Home
            </li>
          </Link>
          <Link href="/about">
            <li className="hidden md:inline text-slate-700 hover:bg-gray-100 px-3 py-3 rounded-full">
              About
            </li>
          </Link>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut className="">
            <Link href="/sign-in">
              <li className="hidden md:inline text-slate-700 hover:bg-gray-100 px-3 py-3 rounded-full">
                Sign In
              </li>
            </Link>
          </SignedOut>
        </ul>
      </div>
    </header>
  );
}
