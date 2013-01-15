<div class="node-add-wrapper clear-block">
    <div class="node-column-main">
        <?php if ($form): ?>
            <?php 
                  print render($form['title']);
             ?>
 <div class="problem-content" style = "border:1px solid black;padding:4px;">
          <?php
                  print render($form['problem_content']);
              ?>
</div>
          <?php
                  print render($form['field_solution_latex']);
                  print render($form['field_solution_problem']);
                  print drupal_render_children($form);
           ?>
        <?php endif; ?>
</div>
</div>
