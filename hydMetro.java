import java.util.*;

class MetroGraph {
    // Each station maps to a list of neighbors: (stationName, distance, line)
    private Map<String, List<Neighbor>> adjList = new HashMap<>();

    static class Neighbor {
        String station;
        int distance;
        String line;

        Neighbor(String station, int distance, String line) {
            this.station = station;
            this.distance = distance;
            this.line = line;
        }
    }

    private String normalize(String s) {
        return s.trim().toLowerCase();
    }

    public void addEdge(String station1, String station2, int distance, String line) {
        String s1 = normalize(station1);
        String s2 = normalize(station2);
        String normalizedLine = normalize(line);

        adjList.computeIfAbsent(s1, k -> new ArrayList<>()).add(new Neighbor(s2, distance, normalizedLine));
        adjList.computeIfAbsent(s2, k -> new ArrayList<>()).add(new Neighbor(s1, distance, normalizedLine));
    }

    public List<PathStep> findShortestPath(String source, String destination) {
        String src = normalize(source);
        String dest = normalize(destination);

        if (!adjList.containsKey(src) || !adjList.containsKey(dest)) return Collections.emptyList();

        Map<String, Integer> distances = new HashMap<>();
        Map<String, PathStep> previous = new HashMap<>();

        for (String station : adjList.keySet()) distances.put(station, Integer.MAX_VALUE);
        distances.put(src, 0);

        PriorityQueue<PathStep> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a.distance));
        pq.add(new PathStep(src, 0, null, ""));

        while (!pq.isEmpty()) {
            PathStep current = pq.poll();
            if (current.station.equals(dest)) break;

            for (Neighbor neighbor : adjList.get(current.station)) {
                int newDist = current.distance + neighbor.distance;
                if (newDist < distances.get(neighbor.station)) {
                    distances.put(neighbor.station, newDist);
                    previous.put(neighbor.station, new PathStep(current.station, newDist, current.station, neighbor.line));
                    pq.add(new PathStep(neighbor.station, newDist, current.station, neighbor.line));
                }
            }
        }

        List<PathStep> path = new ArrayList<>();
        String at = dest;
        while (at != null && previous.containsKey(at)) {
            PathStep step = previous.get(at);
            path.add(new PathStep(at, distances.get(at), step.prev, step.line));
            at = step.prev;
        }

        if (at != null && at.equals(src)) path.add(new PathStep(src, 0, null, ""));

        Collections.reverse(path);

        if (path.isEmpty() || !path.get(0).station.equals(src)) return Collections.emptyList();
        return path;
    }

    public int calculateFare(int distance) {
        int baseFare = 10;
        int perKmCharge = 2;
        return Math.min(baseFare + distance * perKmCharge, 60); // Cap at 60 Rs
    }

    public void displayGraph() {
        for (String station : adjList.keySet()) {
            System.out.print(station + ": ");
            for (Neighbor neighbor : adjList.get(station)) {
                System.out.print("(" + neighbor.station + ", " + neighbor.distance + " km, " + neighbor.line + ") ");
            }
            System.out.println();
        }
    }

    static class PathStep {
        String station;
        int distance;
        String prev;
        String line;

        PathStep(String station, int distance, String prev, String line) {
            this.station = station;
            this.distance = distance;
            this.prev = prev;
            this.line = line;
        }
    }
}

public class hydMetro {
    public static void main(String[] args) {
        MetroGraph metro = new MetroGraph();

        // Add Hyderabad Metro stations and lines
        metro.addEdge("Ameerpet", "Madhapur", 4, "Blue Line");
        metro.addEdge("Madhapur", "HITEC City", 3, "Blue Line");
        metro.addEdge("HITEC City", "Gachibowli", 5, "Blue Line");
        metro.addEdge("Ameerpet", "Begumpet", 3, "Red Line");
        metro.addEdge("Begumpet", "MG Bus Station", 4, "Red Line");
        metro.addEdge("MG Bus Station", "Lalapet", 6, "Red Line");
        metro.addEdge("HITEC City", "Jubilee Hills Check Post", 4, "Blue Line");
        metro.addEdge("Jubilee Hills Check Post", "Peddamma Gudi", 3, "Blue Line");

        System.out.println("Hyderabad Metro Graph:");
        metro.displayGraph();

        Scanner sc = new Scanner(System.in);
        System.out.print("\nEnter source station: ");
        String source = sc.nextLine();
        System.out.print("Enter destination station: ");
        String destination = sc.nextLine();

        List<MetroGraph.PathStep> path = metro.findShortestPath(source, destination);
        if (!path.isEmpty()) {
            System.out.println("\nShortest Path from " + source + " to " + destination + ":");
            for (int i = 0; i < path.size(); i++) {
                System.out.print(path.get(i).station);
                if (i < path.size() - 1) {
                    System.out.print(" (" + path.get(i + 1).line + ") -> ");
                }
            }

            int totalDistance = path.get(path.size() - 1).distance;
            System.out.println("\nTotal Distance: " + totalDistance + " km");
            System.out.println("Total Fare: Rs. " + metro.calculateFare(totalDistance));
        } else {
            System.out.println("\nNo path found between " + source + " and " + destination + "!");
        }
        sc.close();
    }
}
