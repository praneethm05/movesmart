import React from "react";
import { Card, CardContent } from "../Components/Card.js";
import { Button } from "../Components/button.js";
import {
  Activity,
  Navigation,
  MapPin,
  Clock,
  Car,
  Search,
  Home,
  Briefcase,
  TrendingUp,
  Plus,
  User,
  DollarSign,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-emerald-100/60 p-4">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-white/90 p-3 rounded-lg shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <Car className="text-red-500" size={24} />
          <div>
            <span className="font-bold text-xl">Move Smart</span>
            <p className="text-xs text-gray-500">
              the traffic dashboard solution
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <User size={20} className="text-gray-600" />
            <Car size={20} className="text-gray-600" />
            <DollarSign size={20} className="text-gray-600" />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-right">
              <p className="font-medium">You're Currently in</p>
              <p className="text-gray-600">Mangaluru</p>
            </div>
            <MapPin className="text-red-500" size={20} />
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-gray-600" />
          <span className="text-xl font-semibold">2:45 PM</span>
        </div>
        <div className="bg-white px-4 py-1 rounded-md shadow-sm">
          <span className="text-gray-700 font-medium">Drive Points</span>
          <span className="text-red-500 font-bold ml-2">1800</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="space-y-6">
          {/* Traffic Status */}
          <Card className="bg-white/90 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-6">
                Your location is Currently Experiencing
              </h3>
              <div className="flex items-center gap-8">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-[#FFE5E5] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxsaW5lIHgxPSIwIiB5PSIwIiB4Mj0iMCIgeTI9IjQwIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"
                      style={{ opacity: 0.2 }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-red-500 text-xl font-medium">
                    Heavy Traffic for the past 30 min's
                  </p>
                  <p className="text-gray-600 mt-2">
                    Convenient time to drive smoothly Expected:{" "}
                    <span className="text-green-600 font-medium">3:40 PM</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Route Plans */}
          <Card className="bg-white/90 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Active Route Plans</h3>
                <button className="flex items-center gap-1 text-blue-500">
                  <Plus size={16} />
                  <span className="text-sm">Add</span>
                </button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Avengers: Endgame",
                    subtitle: "@Cinepolis 4:00 PM",
                    time: "3:50 PM",
                    duration: "7 Min Drive",
                    details: "700 Meters from Work",
                  },
                  {
                    title: "Home",
                    subtitle: "@1.572382482 8:30 PM",
                    time: "7:50 PM",
                    duration: "7 Min Drive",
                    details: "700 Meters from Work",
                  },
                  {
                    title: "Work",
                    subtitle: "@1.572382482",
                    time: "7:50 PM",
                    duration: "7 Min Drive",
                    details: "700 Meters from Work",
                  },
                ].map((route, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{route.title}</p>
                      <p className="text-gray-500 text-sm">{route.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{route.time}</p>
                      <p className="text-gray-500 text-xs">{route.duration}</p>
                      <p className="text-gray-400 text-xs">{route.details}</p>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6">
                      Go
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-gray-500 text-sm">+ 11 More...</button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Route Input */}
          <Card className="bg-white/90 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Move Where?</h3>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="City Centre, Mall"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6">
                  Go
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="bg-white/90 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-6">
                Insights on Traffic in your region
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-sm">Reported Road Works near</p>
                    <p className="font-medium">@Hampankatta</p>
                  </div>
                  <div className="flex items-center gap-2 text-green-500">
                    <span className="text-xl font-bold">98%</span>
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm">For the past 24 days</p>
                    <p className="font-medium">@Jyothi</p>
                  </div>
                  <div className="flex items-center gap-2 text-green-500">
                    <span className="text-xl font-bold">100%</span>
                    <TrendingUp size={20} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-white/90 shadow-sm">
            <CardContent>
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-700">49 KM</p>
                  <p className="text-sm text-gray-500">Fuel Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-700">50 Hours</p>
                  <p className="text-sm text-gray-500">of Traffic Less Drive</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-700">5000</p>
                  <p className="text-sm text-gray-500">
                    Points Redeemed for Fuel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
