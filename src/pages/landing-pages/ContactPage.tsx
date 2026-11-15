import { ContactHeaderImg } from "../../assets/images"
import ContactForm from "../../components/landing-components/ContactForm"
import RegularHeading from "../../components/landing-components/RegularHeading"

const ContactPage = () => {
  return (
    <div>
      <RegularHeading
        text="GET IN TOUCH WITH OUR CHURCH"
        title="CONTACT"
        imgSrc={ContactHeaderImg}
        diff
      />
      <ContactForm />
    </div>
  )
}

export default ContactPage