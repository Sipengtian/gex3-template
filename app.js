// Destructure the createApp method from Vue
const { createApp } = Vue;

createApp({
  // data() defines all reactive states (data variables) of the application
  data() {
    return {
      // Form data object used to bind user inputs
      form: {
        name: '', 
        dob: '', 
        gender: '',
        totalVisitors: null, 
        children: null,
        accommodation: '',
        cardName: '', 
        cardNumber: '', 
        expiry: '', 
        cvv: ''
      },

      errors: {},

      generalError: '',

      places: [],

      isLoadingPlaces: false,

      placesError: '',

      selectedPlaces: [], 
      
      // Static data for accommodation options
      accommodationOptions: [
        "No accommodation needed",
        "Forest View Hotel",
        "Totoro Family Inn",
        "Witch Valley Guesthouse",
        "Luxury Ghibli Resort"
      ],

      // Controls whether the final itinerary summary card is displayed
      showSummary: false
    }
  },
  
  // Vue Lifecycle Hook: Executes immediately after the component is mounted to the DOM
  mounted() {
    // Automatically fetch park data when the page loads
    this.loadPlaces();
  },
  
  methods: {
    // Async method: Fetches Ghibli Park places data from an external JSON file
    async loadPlaces() {
      this.isLoadingPlaces = true; // Turn on loading indicator
      try {
        const response = await fetch('ghibli_park.json');
        if (!response.ok) throw new Error("Network response was not ok");
        this.places = await response.json(); // Parse and assign to the places array
      } catch (err) {
        this.placesError = "Could not load park data from ghibli_park.json.";
        console.error("Fetch error:", err);
      } finally {
        this.isLoadingPlaces = false; // Turn off loading indicator regardless of success/failure
      }
    },

    // Toggles the selection state of a place (triggered when clicking a card)
    togglePlace(place) {
      // Check if the clicked place already exists in the selected array
      const index = this.selectedPlaces.findIndex(p => p.id === place.id);
      if (index > -1) {
        // If it exists, remove it from the array (deselect)
        this.selectedPlaces.splice(index, 1); 
      } else {
        // If it doesn't exist, push it to the array (select)
        this.selectedPlaces.push(place); 
      }
    },

    // Checks if a specific place is selected, used to dynamically bind CSS classes
    isSelected(place) {
      return this.selectedPlaces.some(p => p.id === place.id);
    },

    // Clears all error messages and hides the summary card
    clearErrors() {
      this.errors = {};
      this.generalError = '';
      this.showSummary = false;
    },

    // Form validation logic
    validateForm() {
      let isValid = true; // Form is valid by default
      
      // Personal details validation
      if (!this.form.name) { this.errors.name = "Full name is required"; isValid = false; }
      if (!this.form.dob) { this.errors.dob = "Date of birth is required"; isValid = false; }
      if (!this.form.gender) { this.errors.gender = "Gender is required"; isValid = false; }

      // Park selection validation: At least one place must be selected
      if (this.selectedPlaces.length === 0) { 
        this.errors.places = "Please select at least one place"; isValid = false; 
      }

      // Visitor count validation
      if (!this.form.totalVisitors || this.form.totalVisitors < 1) { 
        this.errors.totalVisitors = "Must be at least 1 visitor"; isValid = false; 
      }
      if (this.form.children === null || this.form.children < 0) { 
        this.errors.children = "Must be 0 or more"; isValid = false; 
      }

      // Accommodation validation
      if (!this.form.accommodation) { 
        this.errors.accommodation = "Please select an accommodation option"; isValid = false; 
      }

      // Payment details validation
      if (!this.form.cardName) { this.errors.cardName = "Cardholder name is required"; isValid = false; }
      if (!this.form.cardNumber) { this.errors.cardNumber = "Card number is required"; isValid = false; }
      if (!this.form.expiry) { this.errors.expiry = "Expiry date is required"; isValid = false; }
      if (!this.form.cvv) { this.errors.cvv = "CVV is required"; isValid = false; }

      // Return the final validation result
      return isValid;
    },

    // Form submission: Generate the itinerary
    generateItinerary() {
      this.clearErrors(); // Clear historical errors before each submission
  
      if (this.validateForm()) {
        // If validation passes, display the summary card
        this.showSummary = true;
      } else {
        // If validation fails, display a global error message
        this.generalError = "There are mandatory items pending to be filled. Please complete the required fields.";
      }
    }
  }
}).mount('#app'); // Mount the Vue instance to the HTML element with id 'app'