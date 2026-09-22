export interface FacultyMember {
  id: string
  name: string
  designation: string
  department: string
  email: string
  image: string
}

export const FACULTY_DEPARTMENTS = [
  {
    id: 'se',
    name: 'Department of Software Engineering',
    faculty: [
      {
        id: 'dr-anam-qureshi',
        name: 'Dr. Anam Qureshi',
        designation: 'Head of Department (SE)',
        department: 'se',
        email: 'anam.qureshi@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Anam-Qureshi.jpg'
      },
      {
        id: 'dr-usman-ali',
        name: 'Dr. Usman Ali',
        designation: 'Assistant Professor',
        department: 'se',
        email: 'usman.ali@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Usman-Ali.jpg'
      },
      {
        id: 'mr-shoaib-rauf',
        name: 'Mr. Shoaib Rauf',
        designation: 'Lecturer',
        department: 'se',
        email: 'shoaib.rauf@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Shoaib-Rauf.jpg'
      },
      {
        id: 'ms-sobia-iftikhar',
        name: 'Ms. Sobia Iftikhar',
        designation: 'Lecturer',
        department: 'se',
        email: 'sobia.iftikhar@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Sobia-Iftikhar.jpg'
      },
      {
        id: 'syeda-rubab',
        name: 'Syeda Rubab',
        designation: 'Lecturer',
        department: 'se',
        email: 'syeda.rubab@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Syeda-Rubab.jpg'
      },
      {
        id: 'mr-minhal-raza',
        name: 'Mr. Minhal Raza',
        designation: 'Lecturer',
        department: 'se',
        email: 'minhal.raza@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Minhal-Raza.jpg'
      },
      {
        id: 'ms-alina-arshad',
        name: 'Ms. Alina Arshad',
        designation: 'Lecturer',
        department: 'se',
        email: 'alina.arshad@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Alina-Arshad.jpg'
      },
      {
        id: 'ms-simran-melwani',
        name: 'Simran Melwani',
        designation: 'Lecturer',
        department: 'se',
        email: 'simran.melwani@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Simran-Melwani.jpg'
      },
      {
        id: 'ms-muntaha-noor',
        name: 'Ms. Muntaha Noor',
        designation: 'Lecturer',
        department: 'se',
        email: 'muntaha.noor@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Muntaha-Noor.jpg'
      },
      {
        id: 'ms-kinza-mushtaq',
        name: 'Ms. Kinza Mushtaq',
        designation: 'Instructor',
        department: 'se',
        email: 'kinza.mushtaq@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Kinza-Mushtaq.jpg'
      }
    ]
  },
  {
    id: 'cs',
    name: 'FAST School of Computing (Computer Science)',
    faculty: [
      {
        id: 'dr-fahad-samad',
        name: 'Dr. Fahad Samad',
        designation: 'Assistant Professor & HoD (CS)',
        department: 'cs',
        email: 'fahad.samad@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Fahad-Samad.jpg'
      },
      {
        id: 'dr-zulfiqar-memon',
        name: 'Prof. Dr. Zulfiqar Ali Memon',
        designation: 'Professor & Director',
        department: 'cs',
        email: 'zulfiqar.memon@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Zulfiqar-Ali-Memon.jpg'
      },
      {
        id: 'dr-jawwad-shamsi',
        name: 'Dr. Jawwad A. Shamsi',
        designation: 'Professor & Dean',
        department: 'cs',
        email: 'jawwad.shamsi@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Jawwad-Shamsi.jpg'
      },
      {
        id: 'dr-ghufran-ahmed',
        name: 'Dr. Ghufran Ahmed',
        designation: 'Professor',
        department: 'cs',
        email: 'ghufran.ahmed@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Ghufran-Ahmed.jpg'
      },
      {
        id: 'ms-javeria-farooq',
        name: 'Ms. Javeria Farooq',
        designation: 'Lecturer',
        department: 'cs',
        email: 'javeria.farooq@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Javeria-Farooq.jpg'
      },
      {
        id: 'mr-muhammad-jamil',
        name: 'Mr. Muhammad Jamil',
        designation: 'Assistant Professor',
        department: 'cs',
        email: 'm.jamil@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Muhammad-Jamil.jpg'
      }
    ]
  },
  {
    id: 'cyber',
    name: 'Department of Cyber Security',
    faculty: [
      {
        id: 'dr-aqsa-aslam',
        name: 'Dr. Aqsa Aslam',
        designation: 'Head of Department (Cyber Security)',
        department: 'cyber',
        email: 'aqsa.aslam@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Aqsa-Aslam.jpg'
      },
      {
        id: 'mr-abuzar-zafar',
        name: 'Mr. Abuzar Zafar',
        designation: 'Lecturer',
        department: 'cyber',
        email: 'abuzar.zafar@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Abuzar-Zafar.jpg'
      }
    ]
  },
  {
    id: 'ee',
    name: 'Department of Electrical Engineering',
    faculty: [
         {
        id: 'dr-muhammad-junaid-rabbani',
        name: 'Dr. Muhammad Junaid Rabbani',
        designation: 'Assistant Professor & HOD(EE)',
        department: 'ee',
        email: 'junaid.rabbani@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/06/Mr.-Junaid-Rabbani-Assistant-Professor-EE.jpg'
      },
      {
        id: 'dr-burhan-khan',
        name: 'Dr. Burhan Khan',
        designation: 'Professor',
        department: 'ee',
        email: 'burhan.khan@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/06/Dr.-Muhammad-Burhan-Khan-Assistant-Professor-Incharge-EE.jpg' // Mapped with official convention path pattern
      },
      {
        id: 'dr-syed-muhammad-atif-saleem',
        name: 'Dr. Syed Muhammad Atif Saleem',
        designation: 'Associate Professor',
        department: 'ee',
        email: 'atif.saleem@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/06/Dr.-Syed-Muhammad-Atif-Saleem-Assistant-Professor-EE.jpg' // or your fallback/local path
    },
      {
        id: 'dr-haider-mehdi',
        name: 'Dr. Haider Mehdi',
        designation: 'Professor',
        department: 'ee',
        email: 'haider.mehdi@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/06/Dr.-Haider-Mehdi-Associate-Professor-EE.jpg'
      },
      {
        id: 'muhammad-ahsan',
        name: 'Muhammad Ahsan',
        designation: 'Assistant Professor',
        department: 'ee',
        email: 'muhammad.ahsan@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/06/Mr.-Ahsan-Khan-Assistant-Professor-EE.jpg'
      },
      {
        id: 'mr-muhammad-haris-mohsin',
        name: 'Mr. Muhammad Haris Mohsin',
        designation: 'Assistant Professor',
        department: 'ee',
        email: 'haris.mohsin@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Muhammad-Haris-Mohsin.jpg'
      },
      {
        id: 'qurat-ul-ain-sohail',
        name: 'Qurat ul Ain Sohail',
        designation: 'Assistant Professor',
        department: 'ee',
        email: 'quratulain.sohail@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Qurat-ul-Ain-Sohail.jpg'
      },
      {
        id: 'aamir-ali',
        name: 'Aamir Ali',
        designation: 'Lecturer',
        department: 'ee',
        email: 'aamir.ali@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Aamir-Ali.jpg'
      },
      {
        id: 'mr-aqib-noor',
        name: 'Mr. Aqib Noor',
        designation: 'Lecturer',
        department: 'ee',
        email: 'aqib.noor@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Aqib-Noor.jpg'
      },
      {
        id: 'mr-zakir-hussain',
        name: 'Mr. Zakir Hussain',
        designation: 'Lecturer',
        department: 'ee',
        email: 'zakir.hussain@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Zakir-Hussain.jpg'
      },
      {
        id: 'ms-maham-ghauri',
        name: 'Ms. Maham Ghauri',
        designation: 'Lecturer',
        department: 'ee',
        email: 'maham.ghauri@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Maham-Ghauri.jpg'
      },
      {
        id: 'sadaf-ayesha',
        name: 'Sadaf Ayesha',
        designation: 'Lecturer',
        department: 'ee',
        email: 'sadaf.ayesha@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Sadaf-Ayesha.jpg'
      },
      {
        id: 'mr-muhammad-daniyal',
        name: 'Mr. Muhammad Daniyal',
        designation: 'Lab Engineer',
        department: 'ee',
        email: 'muhammad.daniyal@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Muhammad-Daniyal.jpg'
      },
      {
        id: 'mr-zohaib-ahmed',
        name: 'Mr. Zohaib Ahmed',
        designation: 'Lab Engineer',
        department: 'ee',
        email: 'zohaib.ahmed@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Zohaib-Ahmed.jpg'
      },
      {
        id: 'ms-mariam-iqbal',
        name: 'Ms. Mariam Iqbal',
        designation: 'Lab Engineer',
        department: 'ee',
        email: 'mariam.iqbal@nu.edu.pk',
        image: 'https://khi.nu.edu.pk/wp-content/uploads/2023/05/Mariam-Ghauri.jpg' // handled fallback image mapping to match the server convention URL structure
      }
    ]
  }
]