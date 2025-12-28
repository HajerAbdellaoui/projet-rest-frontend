package com.projet.service;

import com.projet.entities.Personne;
import java.util.List;
import java.util.Map;

public interface PersonneService {
    
    // 1. Récupérer toutes les personnes
    public List<Personne> getAllPersonnes();
    
    // 2. Ajouter une personne
    public Map<String, String> addPersonne(Personne p);
    
    // 3. Modifier une personne
    public Map<String, String> updatePersonne(Personne p);
    
    // 4. Supprimer une personne
    public Map<String, String> deletePersonne(Long id);
    
    // 5. Rechercher une personne par ID
    public Personne getPersonneById(Long id);
    
    // 6. Rechercher des personnes par nom
    public List<Personne> searchPersonnesByName(String nom);
    
   
}
