import { StudentProvider } from './constants/context';
import './styles/globals.css';

const getMockStudent = () => ({
  id: 1,
  studentNumber: 'VUT2024001',
  firstName: 'Bokamoso',
  lastName: 'Simelane',
  email: 'bokamoso.simelane@vut.ac.za',
  status: 'Pending',
  documentsComplete: false,
  uploadedDocuments: {},
  setaAllocation: null,
  placement: null,
  notifications: []
});

export default function RootLayout({ children }) {
  const initialStudent = getMockStudent();

  return (
    <html lang="en">
      <body>
        <StudentProvider initialStudent={initialStudent}>
          {children}
        </StudentProvider>
      </body>
    </html>
  );
}
