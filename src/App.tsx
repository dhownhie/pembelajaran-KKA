/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Assignment,
  Announcement,
  LearningMaterial,
  StudentSubmission,
  UserProfile,
} from './types';
import {
  loadStoredUser,
  saveStoredUser,
  loadStoredAssignments,
  saveStoredAssignments,
  loadStoredSubmissions,
  saveStoredSubmissions,
  loadStoredAnnouncements,
  saveStoredAnnouncements,
  loadStoredMaterials,
  saveStoredMaterials,
} from './utils/storage';
import { INITIAL_STUDENT, INITIAL_TEACHER } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AssignmentsView } from './components/AssignmentsView';
import { UploadSubmissionView } from './components/UploadSubmissionView';
import { SubmissionsTableView } from './components/SubmissionsTableView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { LearningMaterialsView } from './components/LearningMaterialsView';
import { ProfileView } from './components/ProfileView';
import { AssignmentFormModal } from './components/AssignmentFormModal';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';

export default function App() {
  // Primary States
  const [currentUser, setCurrentUser] = useState<UserProfile>(loadStoredUser);
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');

  // Educational Data States
  const [assignments, setAssignments] = useState<Assignment[]>(loadStoredAssignments);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(loadStoredSubmissions);
  const [announcements, setAnnouncements] = useState<Announcement[]>(loadStoredAnnouncements);
  const [materials, setMaterials] = useState<LearningMaterial[]>(loadStoredMaterials);

  // Modal & Selection States
  const [selectedAssignmentForUpload, setSelectedAssignmentForUpload] = useState<Assignment | null>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    saveStoredUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStoredAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    saveStoredSubmissions(submissions);
  }, [submissions]);

  useEffect(() => {
    saveStoredAnnouncements(announcements);
  }, [announcements]);

  useEffect(() => {
    saveStoredMaterials(materials);
  }, [materials]);

  // Role Switcher
  const handleSwitchRole = () => {
    if (currentUser.role === 'guru') {
      setCurrentUser(INITIAL_STUDENT);
    } else {
      setCurrentUser(INITIAL_TEACHER);
    }
  };

  // Student selects an assignment to submit
  const handleSelectAssignmentForUpload = (assignment: Assignment) => {
    setSelectedAssignmentForUpload(assignment);
    setActiveTab('kumpulkan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Student submits homework
  const handleSubmitHomework = (submissionData: Omit<StudentSubmission, 'id'>) => {
    const newSubmission: StudentSubmission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
    };
    const updated = [newSubmission, ...submissions];
    setSubmissions(updated);

    // Update student activity count
    if (currentUser.role === 'murid') {
      setCurrentUser((prev) => ({
        ...prev,
        completedTasksCount: (prev.completedTasksCount || 0) + 1,
        starsCount: (prev.starsCount || 0) + 3, // Bonus 3 stars for submitting!
      }));
    }
  };

  // Teacher grades a submission
  const handleGradeSubmission = (
    submissionId: string,
    score: number,
    teacherFeedback: string
  ) => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    const dateStr = `${now.toLocaleDateString('id-ID', options)} WIB`;

    const updated = submissions.map((sub) => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          score,
          teacherFeedback,
          gradingStatus: 'Sudah Dinilai' as const,
          gradedAt: dateStr,
        };
      }
      return sub;
    });

    setSubmissions(updated);
  };

  // Teacher adds or updates assignment
  const handleSaveAssignment = (
    assignmentData: Omit<Assignment, 'id'>,
    editId?: string
  ) => {
    if (editId) {
      setAssignments((prev) =>
        prev.map((a) => (a.id === editId ? { ...assignmentData, id: editId } : a))
      );
    } else {
      const newAssignment: Assignment = {
        ...assignmentData,
        id: `tugas-${Date.now()}`,
      };
      setAssignments((prev) => [newAssignment, ...prev]);

      // Automatically post an announcement for this new task
      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title: `Tugas Baru ${newAssignment.subject}: ${newAssignment.title}`,
        category: 'Tugas Baru',
        content: `Bapak/Ibu Guru telah memberikan tugas baru untuk ${newAssignment.classGroup}. Batas waktu pengumpulan: ${newAssignment.dueDate}. Silakan cek petunjuknya pada menu Informasi Tugas.`,
        author: newAssignment.teacherName,
        date: dateStr,
        pinned: true,
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
    }
    setEditingAssignment(null);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsAssignmentModalOpen(true);
  };

  // Announcements
  const handleAddAnnouncement = (announcementData: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...announcementData,
      id: `ann-${Date.now()}`,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Learning Materials
  const handleAddMaterial = (materialData: Omit<LearningMaterial, 'id'>) => {
    const newMat: LearningMaterial = {
      ...materialData,
      id: `mat-${Date.now()}`,
    };
    setMaterials((prev) => [newMat, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-sky-200 selection:text-sky-900">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'beranda' && (
          <HomeView
            currentUser={currentUser}
            assignments={assignments}
            submissions={submissions}
            announcements={announcements}
            setActiveTab={setActiveTab}
            onOpenCreateAssignmentModal={() => {
              setEditingAssignment(null);
              setIsAssignmentModalOpen(true);
            }}
            onOpenCreateAnnouncementModal={() => {
              setActiveTab('pengumuman');
            }}
          />
        )}

        {activeTab === 'tugas' && (
          <AssignmentsView
            currentUser={currentUser}
            assignments={assignments}
            submissions={submissions}
            setActiveTab={setActiveTab}
            onSelectAssignmentForUpload={handleSelectAssignmentForUpload}
            onOpenCreateAssignmentModal={() => {
              setEditingAssignment(null);
              setIsAssignmentModalOpen(true);
            }}
            onEditAssignment={handleEditAssignment}
            onDeleteAssignment={handleDeleteAssignment}
          />
        )}

        {activeTab === 'kumpulkan' && (
          <UploadSubmissionView
            currentUser={currentUser}
            assignments={assignments}
            selectedAssignmentForUpload={selectedAssignmentForUpload}
            onSubmitHomework={handleSubmitHomework}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'data-murid' && (
          <SubmissionsTableView
            currentUser={currentUser}
            submissions={submissions}
            onGradeSubmission={handleGradeSubmission}
          />
        )}

        {activeTab === 'pengumuman' && (
          <AnnouncementsView
            currentUser={currentUser}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        )}

        {activeTab === 'materi' && (
          <LearningMaterialsView
            currentUser={currentUser}
            materials={materials}
            onAddMaterial={handleAddMaterial}
          />
        )}

        {activeTab === 'profil' && (
          <ProfileView
            currentUser={currentUser}
            onUpdateUser={setCurrentUser}
            onSwitchUser={setCurrentUser}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Modals */}
      <AssignmentFormModal
        isOpen={isAssignmentModalOpen}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          setEditingAssignment(null);
        }}
        onSubmit={handleSaveAssignment}
        initialData={editingAssignment}
        teacherName={currentUser.name}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSelectUser={setCurrentUser}
        currentUser={currentUser}
      />
    </div>
  );
}
