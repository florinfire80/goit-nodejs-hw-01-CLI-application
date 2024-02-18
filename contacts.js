const fs = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");

function listContacts() {
  try {
    readContactsFile((err, contacts) => {
      if (err) {
        throw new Error(`Eroare la listarea contactelor: ${err.message}`);
      }

      console.log("Lista de contacte:", contacts);
    });
  } catch (error) {
    console.error(error.message);
  }
}

function getContactById(contactId) {
  readContactsFile((err, contacts) => {
    if (err) {
      console.error("Eroare la citirea contactelor:", err);
      return;
    }

    const contact = contacts.find((c) => c.id === contactId);

    if (contact) {
      console.log("Contactul cu ID-ul", contactId, "este:", contact);
    } else {
      console.log("Nu s-a găsit niciun contact cu ID-ul", contactId);
    }
  });
}

function removeContact(contactId) {
  try {
    readContactsFile((err, contacts) => {
      if (err) {
        throw new Error(`Eroare la citirea contactelor: ${err.message}`);
      }

      const contactToRemove = contacts.find((c) => c.id === contactId);

      if (!contactToRemove) {
        console.log("Nu s-a găsit niciun contact cu ID-ul", contactId);
        return;
      }

      console.log(
        "Datele contactului care urmează să fie șters:",
        contactToRemove
      );

      const updatedContacts = contacts.filter((c) => c.id !== contactId);

      updatedContacts.forEach((contact, index) => {
        contact.id = (index + 1).toString();
      });

      writeContactsFile(updatedContacts);

      console.log("Contactul cu ID-ul", contactId, "a fost șters.");
    });
  } catch (error) {
    console.error(`Eroare la ștergerea contactului: ${error.message}`);
  }
}

function addContact(name, email, phone) {
  try {
    if (!name || !email || !phone) {
      throw new Error("Nume, email și telefon sunt obligatorii.");
    }

    readContactsFile((err, contacts) => {
      if (err) {
        throw new Error(`Eroare la citirea contactelor: ${err.message}`);
      }

      const duplicateContact = contacts.find(
        (contact) =>
          contact.name === name ||
          contact.email === email ||
          contact.phone === phone
      );

      if (duplicateContact) {
        console.log(
          "Un contact cu aceleași detalii există deja:",
          duplicateContact
        );
        return;
      }

      const lastId = contacts.reduce((maxId, contact) => {
        return Math.max(maxId, parseInt(contact.id));
      }, 0);

      const newId = (lastId + 1).toString();

      const newContact = {
        id: newId,
        name,
        email,
        phone,
      };

      const updatedContacts = [...contacts, newContact];

      console.log("Contactul a fost adăugat cu succes:", newContact);

      writeContactsFile(updatedContacts, (err) => {
        if (err) {
          throw new Error(`Eroare la adăugarea contactului: ${err.message}`);
        }
      });
    });
  } catch (error) {
    console.error(error.message);
  }
}

function readContactsFile(callback) {
  try {
    const data = fs.readFileSync(contactsPath, "utf8");
    const contacts = JSON.parse(data) || [];
    callback(null, contacts);
  } catch (error) {
    if (error.code === "ENOENT") {
      callback(null, []);
    } else {
      callback(error);
    }
  }
}

function writeContactsFile(contacts) {
  const data = JSON.stringify(contacts, null, 2);

  try {
    fs.writeFileSync(contactsPath, data, "utf8");
    console.log("Datele contactelor au fost actualizate cu succes.");
  } catch (err) {
    console.error(`Eroare la scrierea contactelor: ${err.message}`);
    throw err;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
