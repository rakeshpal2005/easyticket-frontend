import { movies } from "./movies";

// Helper to generate ShowSeatDto list
function makeSeats(showSeatIdBase) {
  // 40 seats, first 24 NORMAL, last 16 PREMIUM
  return Array.from({ length: 40 }, (_, i) => {
    const seatIndex = i + 1;
    const seatType = seatIndex <= 24 ? "NORMAL" : "PREMIUM";

    // UI label: A1-A8,B1-B8,C1-C8 for normal; D1-D8,E1-E8 for premium
    const labels = [
      ...Array.from({ length: 8 }, (_, x) => `A${x + 1}`),
      ...Array.from({ length: 8 }, (_, x) => `B${x + 1}`),
      ...Array.from({ length: 8 }, (_, x) => `C${x + 1}`),
      ...Array.from({ length: 8 }, (_, x) => `D${x + 1}`),
      ...Array.from({ length: 8 }, (_, x) => `E${x + 1}`),
    ];

    const seatNumber = labels[i];

    const price = seatType === "NORMAL" ? 150 : 250;

    return {
      id: showSeatIdBase + seatIndex, // ✅ ShowSeatDto.id (THIS is what bookingRequest.seatIds must contain)
      seat: {
        id: 10000 + showSeatIdBase + seatIndex, // SeatDto.id
        seatNumber, // SeatDto.seatNumber
        seatType, // SeatDto.seatType
        basePrice: price, // SeatDto.basePrice
      },
      status: seatIndex % 9 === 0 ? "BOOKED" : "AVAILABLE", // Some seats already booked (UI realism)
      price, // ShowSeatDto.price
    };
  });
}

export const shows = [
  // Movie 1 shows in Kolkata
  {
    id: 101,
    startTime: "2026-03-02T18:00:00",
    endTime: "2026-03-02T21:00:00",
    movie: { ...movies.find((m) => m.id === 1) },
    screen: {
      id: 11,
      name: "Screen 1",
      totalSeats: 40,
      theater: {
        id: 1,
        name: "PVR Mall",
        address: "Salt Lake",
        city: "Kolkata",
        totalScreens: 6,
      },
    },
    availableSeats: makeSeats(5000),
  },
  {
    id: 102,
    startTime: "2026-03-02T21:30:00",
    endTime: "2026-03-03T00:30:00",
    movie: { ...movies.find((m) => m.id === 1) },
    screen: {
      id: 12,
      name: "Screen 2",
      totalSeats: 40,
      theater: {
        id: 2,
        name: "INOX City",
        address: "Park Street",
        city: "Kolkata",
        totalScreens: 5,
      },
    },
    availableSeats: makeSeats(6000),
  },

  // Movie 2 show in Mumbai
  {
    id: 201,
    startTime: "2026-03-02T19:00:00",
    endTime: "2026-03-02T22:10:00",
    movie: { ...movies.find((m) => m.id === 2) },
    screen: {
      id: 21,
      name: "Screen 1",
      totalSeats: 40,
      theater: {
        id: 3,
        name: "Cinepolis",
        address: "Andheri West",
        city: "Mumbai",
        totalScreens: 8,
      },
    },
    availableSeats: makeSeats(7000),
  },
];