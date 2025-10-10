import React from 'react';
import { Heart, Code2, Trophy } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent mb-4">
                            Nextrix
                        </h3>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Transforming ideas into reality with cutting-edge technology and innovative design.
                            Your trusted partner for digital excellence.
                        </p>
                        <div className="flex items-center space-x-2 text-gray-400">
                            <span>Powered by</span>
                            <a href="https://code-vault-one.vercel.app" target='_blank' className='cursor-pointer text-amber-300 hover:underline'>Vault</a>
                            <span>&</span>
                            <a href="https://drez.vercel.app" target='_blank' className='cursor-pointer text-blue-500 hover:underline'>DRE.$</a>
                            {/* <span>by Nextrix Team</span> */}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Services</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Projects</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Mobile Apps</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Pricing</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">Consulting</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">Careers</a></li>
                            <li><a href="/ourTeam" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">Who Are We ?</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-gray-400">
                        © 2025 Nextrix. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;