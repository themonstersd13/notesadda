import React from 'react';
import { BRANCHES } from '../data/mockData';

export const BranchSelectionView = ({ onSelectBranch }) => {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-700 max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Select Your Branch</h1>
                <p className="text-slate-400 text-lg">Choose your engineering discipline to access tailored resources.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {BRANCHES.map((branch) => (
                    <div 
                        key={branch.id}
                        onClick={() => onSelectBranch(branch.id)}
                        className="group relative h-48 rounded-3xl cursor-pointer overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-2xl"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${branch.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <h3 className="text-2xl font-bold text-white mb-1">{branch.name}</h3>
                            <div className="h-1 w-12 bg-white/50 rounded-full group-hover:w-full transition-all duration-500" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
