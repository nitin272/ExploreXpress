import React from 'react';

function Map() {
  return (
    <div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d381424.5446175907!2d75.63688608439939!3d27.071230170982574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db512717f7595%3A0xa85a04fa771a275f!2sHyatt%20Regency%20Jaipur%20Mansarovar!5e0!3m2!1sen!2sin!4v1710219809340!5m2!1sen!2sin"
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default Map;
