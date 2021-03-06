import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutComponent {

  abouts = [

    {title:"1 – L’éditeur:", description:"Cette Application est éditée par l’Association Solidarité Pyrénées à Perpignan (66). 111 AVENUE MARECHAL JOFFRE 66000   PERPIGNAN SIRET: 389 890 591 00016 , le directeur de la publication est Mr CAVAILHES ROUX Laurent ,  représentant légal ."},
    {title:"2 – Contenu:", description:"La structure générale, la charte graphique, l’ensemble des contenus diffusés sur cette application  (images, articles, photos de produits, logos, marques, vidéos, interview, sons, textes, bases de données…) sont protégés par la législation en vigueur en France notamment en matière de propriété intellectuelle et notamment le droit d’auteur, les droits voisins, le droit des marques, le droit à l’image… Et par la législation internationale. Toute représentation et/ou reproduction et/ou exploitation totale(s) ou partielle(s) de cette application et de son contenu, par quelques procédés que ce soient, à quelque titre que ce soit, sans l’autorisation préalable et expresse du représentant légal, est interdite et constituerait une contrefaçon sanctionnée notamment par les articles L335-2 et suivants du code de la propriété intellectuelle, et/ou un acte de concurrence déloyale et/ou un acte de parasitisme susceptible d’engager la responsabilité des personnes qui s’y sont livrées."},
    {title:"3 – Conditions et Droits d’utilisation:", description:"   Cette application est proposée en différents langages.\n" +
      "\n" +
      "        La table de Cana met en œuvre tous les moyens dont elle dispose, pour assurer une information fiable et une mise à jour fiable de ses sites internet et de ses applications. Toutefois, des erreurs ou omissions peuvent survenir. L’internaute devra donc s’assurer de l’exactitude des informations auprès de La Table de Cana à Perpignan et signaler toutes modifications qu’il jugerait utile. La Table de Cana n’est en aucun cas responsable de l’utilisation faite de ces informations, et de tout préjudice direct ou indirect pouvant en découler.\n" +
      "\n" +
      "        Cookies : Le site Internet peut-être amené à vous demander l’acceptation des cookies pour des besoins de statistiques et d’affichage. Un cookies est une information déposée sur votre disque dur par le serveur du site que vous visitez. Il contient plusieurs données qui sont stockées sur votre ordinateur dans un simple fichier texte auquel un serveur accède pour lire et enregistrer des informations . Certaines parties de cette applicatin ne peuvent être fonctionnelles sans l’acceptation de cookies.\n" +
      "\n" +
      "        Liens hypertextes : L'Application et le site peuvent offrir des liens vers d’autres sites internet ou d’autres ressources disponibles sur Internet. La Table de Cana ne dispose d’aucun moyen pour contrôler les sites en connexion avec ses sites internet.  La Table de Cana ne répond pas de la disponibilité de tels sites et sources externes, ni ne la garantit. Elle ne peut être tenue pour responsable de tout dommage, de quelque nature que ce soit, résultant du contenu de ces sites ou sources externes, et notamment des informations, produits ou services qu’ils proposent, ou de tout usage qui peut être fait de ces éléments. Les risques liés à cette utilisation incombent pleinement à l’internaute, qui doit se conformer à leurs conditions d’utilisation.\n" +
      "\n" +
      "        Les utilisateurs, les abonnés et les visiteurs des sites internet  ne peuvent mettre en place un hyperlien en direction de ce site et de l'application mobile sans l’autorisation expresse et préalable de l’Association solidarité Pyrénées à Perpignan. Dans l’hypothèse où un utilisateur ou visiteur souhaiterait mettre en place un hyperlien en direction d’un des sites internet et de l'application de La Table de Cana à Perpignan, il lui appartiendra d’adresser un email accessible afin de formuler sa demande de mise en place d’un hyperlien. L’ association se réserve le droit d’accepter ou de refuser un hyperlien sans avoir à en justifier sa décision.\n" +
      "\n" +
      "        Le droit d’usage conféré à l’utilisateur est personnel et privé : c’est-à-dire que toute reproduction de tout ou partie du contenu du site et de l'application mobile sur un quelconque support pour un usage professionnel, est prohibée.\n" +
      "        Cet usage comprend seulement l’autorisation d’envoyer par mail et de partager un article du site et/ou de l'application à un ami. Tout autre usage est soumis à l’autorisation préalable et expresse de l’éditeur.  La violation de ces dispositions soumet le contrevenant et toutes personnes responsables aux peines pénales et civiles prévues par la loi française. L’accès à certains services peut amener le site Internet à déposer un cookie. Celui-ci ne contient pas d’informations nominatives vous concernant, et susceptibles d’être exploitées par des tiers."},
    {title:"4 – Données personnelles / Droit d’accès et de rectification:", description:"Cette application contient des données personnelles liées à l’utilisation des fonctions du formulaire de contact. Conformément à la loi « informatique et libertés » du 6 janvier 1978, vous bénéficiez d’un droit d’accès et de rectification aux informations qui vous concernent. Si vous souhaitez exercer ce droit,  faire la demande en écrivant à “contact[@]tabledecana-perpignan.com”. Toute utilisation par un tiers d’informations personnelles contenues sur le site (et en particulier collecte, démarchage…) est passible de sanctions pénales. Litiges : Les présentes conditions du site Internet et de son application mobile sont régies par les lois françaises et toute contestation ou litiges qui pourraient naître de l’interprétation ou de l’exécution de celles-ci seront de la compétence exclusive des tribunaux dont dépend le siège social de l’ Association. La langue de référence, pour le règlement de contentieux éventuels, est le français. "},
    {title:"5- Hébergement:", description:"Cette application est pour partie hébergée sur les serveurs de : 1 and 1 France, 1&1 Internet SARL\n" +
      "        7, place de la Gare BP 70109, 57201 Sarreguemines Cedex "}

    ];

  shownGroup = null;


  constructor(public navCtrl: NavController) {

  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    return this.shownGroup === group;
  };



}
