## Start application
npm run start

## Run unit test
npm run test

## Architechtural decisions

### Data Binding Approach
Instead of using @Input() and @Output(), I chose a reactive approach with BehaviorSubjects. While @Input() and @Output() might suffice for this simple application, a reactive approach ensures easier maintenance and scalability as application features expand.

### Map Choice
I considered both Google Maps and Leaflet. I opted for Leaflet due to its free availability and ease of setup. Unlike Google Maps, Leaflet doesn’t require setting up a project in the Google Console or generating an API token.

### Chart Choice
Initially, I used Chart.js but encountered difficulties in setting the dimensions properly. I switched to ECharts, which provided a more straightforward configuration for the chart dimensions.

### Unit testing
For testing purposes, I set all fields and methods with appropriate accessors (public/private) to ensure only public methods are tested. This approach adheres to the principle of testing only the external behavior of components, ensuring that internal implementation details can be changed without affecting the tests. This aligns with the principles of encapsulation and information hiding, promoting more robust and maintainable code.