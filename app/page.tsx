import Link from "next/link";
import { CalendarCheck, Music2, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-normal">
            Bar & Entertainer
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Login
            </Link>
            <Link href="/register" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
              Register
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase text-gray-500">
              Event booking workspace
            </p>
            <h1 className="text-5xl font-semibold leading-tight tracking-normal text-black md:text-6xl">
              Book entertainers and manage bar events in one place.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              A focused MVP for event organizers to publish events, find performers, and track bookings, with a separate workspace for entertainers to manage requests.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                Create account
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-md border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50">
                Go to dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-[#fafafa] p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Tonight&apos;s pipeline</p>
                <p className="text-xs text-gray-500">Live MVP snapshot</p>
              </div>
              <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">Active</span>
            </div>

            <div className="space-y-3">
              {[
                { icon: CalendarCheck, label: "Open events", value: "12", detail: "4 private, 8 public" },
                { icon: Music2, label: "Available entertainers", value: "38", detail: "DJs, singers, bands" },
                { icon: Users, label: "Pending bookings", value: "7", detail: "Awaiting response" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                    <item.icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.detail}</p>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
