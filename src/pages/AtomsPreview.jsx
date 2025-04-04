import React, { useState } from 'react';

export default function AtomsPreview() {
  const [toggleOn, setToggleOn] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">FirstPitch Atom Components</h1>

      {/* Buttons */}
      <div className="space-x-4">
        <button className="bg-blue-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-600">
          Primary Button
        </button>
        <button className="bg-gray-200 text-gray-800 font-semibold px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-300">
          Secondary Button
        </button>
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          +
        </button>
      </div>

      {/* Inputs */}
      <div className="space-y-4 max-w-md">
        <label className="text-sm font-medium text-gray-700">Text Input</label>
        <input type="text" placeholder="Enter text" className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base" />

        <label className="text-sm font-medium text-gray-700">Text Area</label>
        <textarea placeholder="Enter details" className="w-full rounded-lg border border-gray-300 px-4 py-2 resize-none min-h-[100px]" />
      </div>

      {/* Badge */}
      <div>
        <span className="inline-block rounded-full bg-blue-100 text-blue-800 text-xs px-3 py-1 font-semibold">
          9U
        </span>
      </div>

      {/* Toggle */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">Toggle</span>
        <div
          onClick={() => setToggleOn(!toggleOn)}
          className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
            toggleOn ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
              toggleOn ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="mb-2 text-sm font-medium text-gray-700">Progress</div>
        <div className="w-full h-4 bg-gray-200 rounded-full">
          <div className="h-4 bg-blue-500 rounded-full" style={{ width: '60%' }} />
        </div>
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
        JR
      </div>
    </div>
  );
}
