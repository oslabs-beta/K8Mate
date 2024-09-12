<div align="center">

![Asset 8@3x-100](https://github.com/user-attachments/assets/bd9aa57c-0f0a-46b6-9923-8107d491f2ff)

<p align="center">
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/typescript-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  </a>
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/badge/react-%234E9FF9?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  </a>
  <a href="https://www.javascript.com/">
    <img src="https://img.shields.io/badge/javascript-yellow?style=for-the-badge&logo=javascript&logoColor=white" alt="JavaScript"/>
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS">
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  </a>
  <a href="https://nodejs.org/en">
    <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS"/>
  </a>
  <a href="https://expressjs.com/">
    <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js"/>
  </a>
  <a href="https://aws.amazon.com/">
    <img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS"/>
  </a>
  <a href="https://kubernetes.io/">
    <img src="https://img.shields.io/badge/kubernetes-%23326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes"/>
  </a>
  <a href="https://prometheus.io/">
    <img src="https://img.shields.io/badge/prometheus-%23E6522C?style=for-the-badge&logo=prometheus&logoColor=white" alt="Prometheus"/>
  </a>
  <a href="https://grafana.com/">
    <img src="https://img.shields.io/badge/grafana-%23F46800?style=for-the-badge&logo=grafana&logoColor=white" alt="Grafana"/>
  </a>
  <a href="https://www.docker.com/">
    <img src="https://img.shields.io/badge/docker-%232496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  </a>
  <a href="https://www.postgresql.org/">
    <img src="https://img.shields.io/badge/postgresql-blue?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  </a>
  <a href="https://jestjs.io/">
    <img src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest"/>
  </a>
  <a href="https://www.cypress.io/">
    <img src="https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e" alt="Cypress"/>
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  </a>
</p>

---

<p align="center" style="font-size: 1em">
<a name="website" href="https://oslabs-beta.github.io/MorpheusLanding/](https://github.com/oslabs-beta/K8Mate">Website</a>
<a name="medium" href="">Medium</a>
<a name="linkedin" href="">LinkedIn</a>
</p>
</div>


### Welcome to K8 Mate - v1.0.0
Welcome to K8 Mate, a light-weight, easy-to-use Kubernetes management and observability tool.

| Features                                                     |
| ------------------------------------------------------------ |
| Dashboard forfor key metrics monitoring via Prometheus API                  |
| Real-time alerts for resource usage, pod outages, restarts, and other structural changes                |
| K8 cluster visualization tool via React Flow to manage and cluster architecture | 
| Built-in Terminal view to manage your cluster, nodes, pods, and services |
 
## Getting Started

**IMPORTANT -- Requirements to Use K8 Mate**  

✅ Active Kubernetes cluster deployed on AWS  
✅ Kubectl configured on local machine  
✅ Prometheus installed on your K8 cluster  
✅ Grafana installed on your K8 cluster  
✅ An active database for your team in PostgresQL (only supported at this time)

**How to Run the App**
1. Install npm dependencies `npm install` in the root, frontend, and backend directories, for a total of 3 times.
2. Expose port 9090 to the Prometheus API `kubectl port-forward svc/prometheus-node-port-service 9090:9090`
3. Expose port 3000 to the Grafana service node `kubectl port-forward svc/grafana-node-port-service 3000:80`
5. Run the development server `npm run dev` from the root directory
6. Connect your DB in the settings tab! Setup is already provided in our backend directory to interact with your DB.
7. All done!

## Feature Highlights

| Reports                                                     | Alerts                                                     |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/0bc42378-fb4d-4daa-b522-5ddc58d9e9f6" alt="dashboard-showcase" style="width: 400px; border-radius: 8px;" /> | <img src="https://github.com/user-attachments/assets/dfa532d8-8d07-483a-af3a-a8167e66e7b0" alt="alerts-showcase" style="width: 400px; border-radius: 8px;" /> |

| K8 Visualization                                            | In-App Terminal                                            |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/3a5b7840-6ee4-4de1-8517-1a7e6a2672eb" alt="K8 Dashboard" style="width: 400px; border-radius: 8px;" /> | <img src="https://github.com/user-attachments/assets/e68aeb73-dda9-4ffb-a46a-c0fbbfff1aba" alt="K8 Terminal" style="width: 400px; border-radius: 8px;" /> |


## Want to Contribute?

Our goal is to continue to evolve K8 Mate, expanding features while maintaing its ease-of-use. We're grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving K8 Mate.

- Fork the project.
- Create and work off of your feature branch.
- Create a pull request with a detailed description of your changes from your feature branch to dev branch.
- Please let us know when PR submission is done. Once the changes are reviewed and approved, we will merge your code into the main repository.

Follow our dev READme to learn more



## Meet the team
| Owners          | GitHub                                                                 | LinkedIn                                                                  |
|---------------|------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| Jonathan Si   | [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jon-si) | [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jonathan-j-si/) |
| Aaron Thien   | [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aaronthien) | [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aaronthien/) |
| Richard To    | [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rto24) | [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/richardto24/) |
| Stephen Sinco | [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ssinco) | [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/stephen-sinco/) |
