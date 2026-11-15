import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { getMinisters } from "../../api/admin-dashboard-apis";
import { useAuth } from "../../hooks/useAuth";
import type { MinisterPropType } from "../../constants/basic-types";

interface MinisterSelectProps {
    label: string;
    onSelect: (ministerId: number) => void;
    error?: string;
}

const MinisterSelect: React.FC<MinisterSelectProps> = ({ label, onSelect, error }) => {
    const { accessToken } = useAuth();
    const [ministers, setMinisters] = useState<MinisterPropType[]>([]);
    const [filteredMinisters, setFilteredMinisters] = useState<MinisterPropType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMinister, setSelectedMinister] = useState<MinisterPropType | null>(null);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMinisters = async () => {
            setLoading(true);
            try {
                const res = await getMinisters({ token: accessToken! });
                setMinisters(res);
                setFilteredMinisters(res);
            } catch (err) {
                console.error("Failed to fetch ministers", err);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchMinisters();
        }
    }, [accessToken]);

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = ministers.filter(
            (m) =>
                m.user.firstname.toLowerCase().includes(lowerSearch) ||
                m.user.lastname.toLowerCase().includes(lowerSearch) ||
                m.title.toLowerCase().includes(lowerSearch)
        );
        setFilteredMinisters(filtered);
    }, [searchTerm, ministers]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (minister: MinisterPropType) => {
        setSelectedMinister(minister);
        onSelect(minister.id);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="flex flex-col space-y-1" ref={dropdownRef}>
            <label className="font-normal text-base text-[#383838]">{label}</label>
            <div className="relative">
                <div
                    className="w-full p-3 rounded-[5px] border-[1px] border-[#EAECF0] bg-white cursor-pointer flex justify-between items-center"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={selectedMinister ? "text-gray-900" : "text-[#7A7A7A]"}>
                        {selectedMinister
                            ? `${selectedMinister.user.firstname} ${selectedMinister.user.lastname} - ${selectedMinister.title}`
                            : "Select a minister"}
                    </span>
                    <FiChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search ministers..."
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-main-orange"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-4 text-center text-gray-500 text-sm">Loading ministers...</div>
                        ) : filteredMinisters.length > 0 ? (
                            filteredMinisters.map((minister) => (
                                <div
                                    key={minister.id}
                                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                                    onClick={() => handleSelect(minister)}
                                >
                                    <div className="font-medium">{minister.user.firstname} {minister.user.lastname}</div>
                                    <div className="text-xs text-gray-500">{minister.title}</div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">No ministers found</div>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-[12px] text-red-500">{error}</p>}
        </div>
    );
};

export default MinisterSelect;
