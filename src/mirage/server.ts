import {createServer, Model } from 'miragejs';

export function makeServer(){
    return createServer({
        models: {
            employee: Model
        }, 
        seeds(server){
            server.create("employee", { id: 1, name: "John Doe", position: "Developer", department: "IT" });
            server.create("employee", { id: 2, name: "Jane Smith", position: "Designer", department: "UI/UX" });
            server.create("employee", { id: 3, name: "Alice Johnson", position: "Manager", department: "HR" });
            server.create("employee", { id: 4, name: "Bob Brown", position: "Tester", department: "QA" });
            server.create("employee", { id: 5, name: "Eve Davis", position: "Analyst", department: "Business" });
            server.create("employee", { id: 6, name: "Frank White", position: "Admin", department: "Operations" });
            server.create("employee", { id: 7, name: "Grace Black", position: "Support", department: "Customer" });
            server.create("employee", { id: 8, name: "Henry Blue", position: "Consultant", department: "Finance" });
            server.create("employee", { id: 9, name: "Ivy Green", position: "Architect", department: "Engineering" });
            server.create("employee", { id: 10, name: "Jack Gray", position: "Intern", department: "Training" });
        },
        routes() {
            this.namespace = "api";
            this.get("/employees", (schema) => schema.all("employee"));
            this.post("/employees", (schema, request) => schema.create("employee", JSON.parse(request.requestBody)));
            this.put("/employees/:id", (schema, request) => {
                const id = request.params.id;
                const attrs = JSON.parse(request.requestBody);
                return schema.find("employee", id)?.update(attrs);
            });
            this.delete("/employees/:id", (schema, request) => {
                const id = request.params.id;
                return schema.find("employee", id)?.destroy();
            });this.namespace = "api";
        },
    })
}