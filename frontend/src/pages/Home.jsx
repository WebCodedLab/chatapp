import React from 'react'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Connect with Friends,<br />Share Your Story
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join our community and stay connected with the people who matter most to you.
            Share moments, create memories, and build lasting relationships.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-6">🤝</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-100">Make New Friends</h3>
              <p className="text-gray-300 leading-relaxed">Connect with like-minded people and expand your social circle through shared interests and meaningful conversations.</p>
            </div>
            
            <div className="p-8 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-6">💬</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-100">Real-time Chat</h3>
              <p className="text-gray-300 leading-relaxed">Stay in touch with instant messaging, group conversations, and seamless communication tools.</p>
            </div>
            
            <div className="p-8 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-6">🌟</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-100">Share Moments</h3>
              <p className="text-gray-300 leading-relaxed">Share your special moments, milestones, and daily adventures while staying updated with friends' activities.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home