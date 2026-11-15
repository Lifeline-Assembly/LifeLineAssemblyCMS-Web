import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { getAllMembers } from "../../api/admin-dashboard-apis";
import { useAuth } from "../../hooks/useAuth";
import type { Member } from "../../constants/basic-types";

interface MemberSelectProps {
    label: string;
    onSelect: (memberId: number) => void;
    error?: string;
}

const MemberSelect: React.FC<MemberSelectProps> = ({ label, onSelect, error }) => {
    const { accessToken } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const res = await getAllMembers({ token: accessToken! });
                // Filter only verified members
                const verifiedMembers = res.filter((m: Member) => m.membership_verified);
                setMembers(verifiedMembers);
                setFilteredMembers(verifiedMembers);
            } catch (err) {
                console.error("Failed to fetch members", err);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchMembers();
        }
    }, [accessToken]);

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = members.filter(
            (m) =>
                m.firstname.toLowerCase().includes(lowerSearch) ||
                m.lastname.toLowerCase().includes(lowerSearch) ||
                m.email?.toLowerCase().includes(lowerSearch)
        );
        setFilteredMembers(filtered);
    }, [searchTerm, members]);

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

    const handleSelect = (member: Member) => {
        setSelectedMember(member);
        onSelect(member.id);
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
                    <span className={selectedMember ? "text-gray-900" : "text-[#7A7A7A]"}>
                        {selectedMember
                            ? `${selectedMember.firstname} ${selectedMember.lastname}`
                            : "Select a member"}
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
                                    placeholder="Search members..."
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-main-orange"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-4 text-center text-gray-500 text-sm">Loading members...</div>
                        ) : filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                                    onClick={() => handleSelect(member)}
                                >
                                    <div className="font-medium">{member.firstname} {member.lastname}</div>
                                    <div className="text-xs text-gray-500">{member.email}</div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">No members found</div>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-[12px] text-red-500">{error}</p>}
        </div>
    );
};

export default MemberSelect;
