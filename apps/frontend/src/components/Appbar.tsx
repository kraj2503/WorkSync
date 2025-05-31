import { Button } from "./ui/button";

export default function Appbar() {
  return (
    <nav className="w-full  bg-gradient-to-r from-indigo-500 via-orange-400 to-indigo-500 h-auto">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="text-xl font-bold px-7 text-white">WorkSync</div>
        <ul className="flex space-x-6">
          <li>
            <Button variant="home">Home</Button>
          </li>
          <li>

            <Button variant="home">Login</Button>
          </li>
          <li>
            <Button variant="signup">Signup</Button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
